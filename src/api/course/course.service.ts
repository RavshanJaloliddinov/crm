import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CourseEntity } from './entities/course.entity';
import { CreateCourseDto, UpdateCourseDto } from './dto';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateCourseDto) {
    const course = new CourseEntity({ ...dto, seatsAvailable: dto.capacity });

    const created = await this.prisma.course.create({
      data: { ...course },
    });

    this.logger.log(`Course created: ${created.id}`);
    return {
      statusCode: 201,
      message: 'Course created successfully',
      data: created,
    };
  }

  async findAll(filter?: 'upcoming' | 'ongoing' | 'completed') {
    const courses = await this.prisma.course.findMany();
    const mapped = courses.map(c => new CourseEntity(c));

    const data = filter
      ? mapped.filter(course => course.getStatus() === filter)
      : mapped;

    return {
      statusCode: 200,
      message: 'Courses retrieved successfully',
      data,
    };
  }

  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');

    return {
      statusCode: 200,
      message: 'Course retrieved successfully',
      data: new CourseEntity(course),
    };
  }

  async update(id: number, dto: UpdateCourseDto) {
    const existing = await this.prisma.course.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Course not found');

    const courseEntity = new CourseEntity({
      ...existing,
    });

    if (dto.capacity !== undefined && dto.capacity !== existing.capacity) {
      const currentEnrolled = existing.capacity - existing.seatsAvailable;
      courseEntity.updateCapacity(dto.capacity, currentEnrolled);
    }

    if (dto.title !== undefined) courseEntity.title = dto.title;
    if (dto.description !== undefined) courseEntity.description = dto.description;
    if (dto.startDate !== undefined) courseEntity.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) courseEntity.endDate = new Date(dto.endDate);
    if (dto.instructorId !== undefined) courseEntity.instructorId = dto.instructorId;

    const updated = await this.prisma.course.update({
      where: { id },
      data: {
        title: courseEntity.title,
        description: courseEntity.description,
        startDate: courseEntity.startDate,
        endDate: courseEntity.endDate,
        capacity: courseEntity.capacity,
        seatsAvailable: courseEntity.seatsAvailable,
        instructorId: courseEntity.instructorId,
      },
    });

    // 6️⃣ Return format
    return {
      statusCode: 200,
      message: 'Course updated successfully',
      data: updated,
    };
  }


  async remove(id: number) {
    const enrollments = await this.prisma.enrollment.count({ where: { courseId: id } });
    if (enrollments > 0) {
      throw new ConflictException('Cannot delete course with existing enrollments');
    }

    const deleted = await this.prisma.course.delete({ where: { id } });
    this.logger.log(`Course deleted: ${deleted.id}`);

    return {
      statusCode: 200,
      message: 'Course deleted successfully',
      data: deleted,
    };
  }
}
