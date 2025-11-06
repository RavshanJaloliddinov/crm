import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtAuthGuard } from 'src/common/guards/AuthGuard';
import { Public } from 'src/common/decorators/public';
import { LoginDto, RefreshTokenDto } from './dto';
import { IpThrottleGuard } from 'src/common/guards/ip-throttle.guard';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // async register(@Body() createUserDto: CreateUserDto) {
  //   return await this.authService.register(createUserDto);
  // }

  @UseGuards(IpThrottleGuard) // ✅ IP bo‘yicha limiter shu endpointga
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }


  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: RefreshTokenDto) {
    return await this.authService.refreshToken(body.userId, body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req) {
    return await this.authService.logout(req.user.id);
  }
}
