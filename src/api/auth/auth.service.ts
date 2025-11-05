import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptEncryption } from 'src/infrastructure/bcrypt';
import { JwtHelper } from 'src/infrastructure/jwt/jwt.helper';
import { RedisCacheService } from 'src/infrastructure/redis/redis.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { config } from 'src/config';
import { UserRoles } from 'src/common/database/Enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisCacheService,
  ) { }

  // 🧩 Register
  async register(dto: CreateUserDto) {
    const { email, password } = dto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new UnauthorizedException('User with this email already exists');

    const hashedPassword = await BcryptEncryption.encrypt(password);

    const newUser = await this.prisma.user.create({
      data: { ...dto, password: hashedPassword, role: UserRoles.SUPER_ADMIN },
    });

    // const accessToken = JwtHelper.signAccessToken({ id: newUser.id, email: newUser.email});
    // const refreshToken = JwtHelper.signRefreshToken({ id: newUser.id, email: newUser.email });

    // const refreshTtl = this.getRefreshTokenTTL();
    // await this.redisService.set(`refresh:${newUser.id}`, refreshToken, refreshTtl);

    this.logger.log(`User registered: ${newUser.id}`);

    return {
      status: HttpStatus.CREATED,
      message: 'User registered successfully',
      data: newUser,
    };
  }

  // 🟢 Login
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await BcryptEncryption.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const accessToken = JwtHelper.signAccessToken({ id: user.id, email: user.email, role: user.role});
    const refreshToken = JwtHelper.signRefreshToken({ id: user.id, email: user.email, role: user.role });

    const refreshTtl = this.getRefreshTokenTTL();
    await this.redisService.set(`refresh:${user.id}`, refreshToken, refreshTtl);

    this.logger.log(`User logged in: ${user.id}`);

    return {
      status: HttpStatus.OK,
      message: 'Login successful',
      data: { accessToken, refreshToken },
    };
  }

  // 🔄 Refresh token
  async refreshToken(userId: number, oldRefreshToken: string) {
    const storedToken = await this.redisService.get(`refresh:${userId}`);
    if (!storedToken || storedToken !== oldRefreshToken) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const decoded = JwtHelper.verifyRefreshToken(oldRefreshToken);
    if (!decoded) throw new UnauthorizedException('Refresh token expired or invalid');

    const newAccessToken = JwtHelper.signAccessToken({ id: decoded.id, email: decoded.email });
    const newRefreshToken = JwtHelper.signRefreshToken({ id: decoded.id, email: decoded.email });

    const refreshTtl = this.getRefreshTokenTTL();
    await this.redisService.set(`refresh:${userId}`, newRefreshToken, refreshTtl);

    this.logger.log(`Token refreshed for user: ${userId}`);

    return {
      status: HttpStatus.OK,
      message: 'Token refreshed successfully',
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    };
  }

  // 🚪 Logout
  async logout(userId: number) {
    await this.redisService.deleteByText(`refresh:${userId}`);
    this.logger.log(`User logged out: ${userId}`);

    return { status: HttpStatus.OK, message: 'Logout successful' };
  }

  // 🔧 Refresh token TTL calculation
  private getRefreshTokenTTL(): number {
    const expireStr = config.REFRESH_TOKEN_EXPIRE_TIME; // e.g. "7d", "12h"
    const match = expireStr.match(/^(\d+)([dhm])$/);
    if (!match) return 7 * 24 * 60 * 60;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 'd':
        return value * 24 * 60 * 60;
      case 'h':
        return value * 60 * 60;
      case 'm':
        return value * 60;
      default:
        return 7 * 24 * 60 * 60;
    }
  }
}
