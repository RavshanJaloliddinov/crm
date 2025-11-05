import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInstructorDto, UpdateInstructorDto } from './dto';
import { InstructorEntity } from './entities/instructor.entity';

@Injectable()
export class InstructorService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateInstructorDto) {
    // Email uniqueness check
    const existing = await this.prisma.instructor.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const created = await this.prisma.instructor.create({ data: dto });
    const entity = new InstructorEntity(created);

    return {
      statusCode: 201,
      message: 'Instructor created successfully',
      data: entity,
    };
  }

  async findAll() {
    const instructors = await this.prisma.instructor.findMany();
    return {
      statusCode: 200,
      message: 'Instructors fetched successfully',
      data: instructors.map(i => new InstructorEntity(i)),
    };
  }

  async findOne(id: number) {
    const instructor = await this.prisma.instructor.findUnique({ where: { id } });
    if (!instructor) throw new NotFoundException('Instructor not found');

    return {
      statusCode: 200,
      message: 'Instructor fetched successfully',
      data: new InstructorEntity(instructor),
    };
  }

  async update(id: number, dto: UpdateInstructorDto) {
    const existing = await this.prisma.instructor.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Instructor not found');

    // Email uniqueness check if email updated
    if (dto.email && dto.email !== existing.email) {
      const conflict = await this.prisma.instructor.findUnique({ where: { email: dto.email } });
      if (conflict) throw new ConflictException('Email already in use');
    }

    const updated = await this.prisma.instructor.update({ where: { id }, data: dto });
    return {
      statusCode: 200,
      message: 'Instructor updated successfully',
      data: new InstructorEntity(updated),
    };
  }

  async remove(id: number) {
    const instructor = await this.prisma.instructor.findUnique({ where: { id } });
    if (!instructor) throw new NotFoundException('Instructor not found');

    await this.prisma.instructor.delete({ where: { id } });
    return {
      statusCode: 200,
      message: 'Instructor deleted successfully',
      data: null,
    };
  }
}
