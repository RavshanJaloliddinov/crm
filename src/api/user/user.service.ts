import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserEntity } from './entities/user.entity';
import { BcryptEncryption } from 'src/infrastructure/bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const hashedPassword = await BcryptEncryption.encrypt(dto.password);

    const created = await this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
    });

    this.logger.log(`User created: ${created.id}`);

    return { statusCode: 201, message: 'User created successfully', data: new UserEntity(created) };
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return { statusCode: 200, message: 'Users retrieved', data: users.map(u => new UserEntity(u)) };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return { statusCode: 200, message: 'User retrieved', data: new UserEntity(user) };
  }

  async update(id: number, dto: UpdateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('User not found');

    if (dto.email && dto.email !== existing.email) {
      const conflict = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (conflict) throw new ConflictException('Email already in use');
    }

    let updatedData = { ...dto };
    if (dto.password) {
      updatedData.password = await BcryptEncryption.encrypt(dto.password);
    }

    const updated = await this.prisma.user.update({ where: { id }, data: updatedData });
    this.logger.log(`User updated: ${updated.id}`);

    return { statusCode: 200, message: 'User updated successfully', data: new UserEntity(updated) };
  }

  async remove(id: number) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('User not found');

    await this.prisma.user.delete({ where: { id } });
    this.logger.log(`User deleted: ${id}`);

    return { statusCode: 200, message: 'User deleted successfully', data: null };
  }
}
