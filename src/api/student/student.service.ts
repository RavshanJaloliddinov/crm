import { Injectable, NotFoundException, Logger, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StudentEntity } from './entities/student.entity';
import { CreateStudentDto, UpdateStudentDto } from './dto';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateStudentDto) {
    const existing = await this.prisma.student.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const created = await this.prisma.student.create({ data: dto });
    this.logger.log(`Student created: ${created.id}`);
    return { statusCode: 201, message: 'Student created', data: created };
  }

  async findAll() {
    const students = await this.prisma.student.findMany();
    return { statusCode: 200, message: 'Students retrieved', data: students };
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: { enrollments: true },
    });
    if (!student) throw new NotFoundException('Student not found');
    return { statusCode: 200, message: 'Student retrieved', data: student };
  }

  async findHistory(id: number) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId: id },
      include: { course: true },
    });
    return { statusCode: 200, message: 'Student enrollment history retrieved', data: enrollments };
  }

  async update(id: number, dto: UpdateStudentDto) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');

    // Email uniqueness check if email updated
    if (dto.email && dto.email !== student.email) {
      const conflict = await this.prisma.student.findUnique({ where: { email: dto.email } });
      if (conflict) throw new ConflictException('Email already in use');
    }

    const updated = await this.prisma.student.update({
      where: { id },
      data: dto,
    });

    this.logger.log(`Student updated: ${updated.id}`);
    return { statusCode: 200, message: 'Student updated', data: updated };
  }

  async remove(id: number) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');

    // Optional: unenroll student from all courses before deletion
    await this.prisma.enrollment.deleteMany({ where: { studentId: id } });

    await this.prisma.student.delete({ where: { id } });

    this.logger.log(`Student deleted: ${id}`);
    return { statusCode: 200, message: 'Student deleted', data: null };
  }
}
