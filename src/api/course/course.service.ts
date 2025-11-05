import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CourseEntity } from './entities/course.entity';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { InstructorService } from '../instructor/instructor.service';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly instructorService: InstructorService
  ) { }

  async create(dto: CreateCourseDto) {

    const course = new CourseEntity({ ...dto, seatsAvailable: dto.capacity });

    if (dto.capacity <= 0) throw new ConflictException('Capacity must be a positive number');
    
    const instructor = await this.instructorService.findOne(dto.instructorId)
    if(!instructor) throw new NotFoundException('Instructor not found')

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
  const now = new Date();

  let where = {};
  if (filter === 'upcoming') {
    where = { startDate: { gt: now } };
  } else if (filter === 'ongoing') {
    where = { startDate: { lte: now }, endDate: { gte: now } };
  } else if (filter === 'completed') {
    where = { endDate: { lt: now } };
  }

  const courses = await this.prisma.course.findMany({
    where,
    orderBy: { startDate: 'asc' },
  });

  return {
    statusCode: 200,
    message: 'Courses retrieved successfully',
    data: courses.map(c => new CourseEntity(c)),
  };
}
async findAllWithUsers(filter?: 'upcoming' | 'ongoing' | 'completed') {
  const now = new Date();

  let where = {};
  if (filter === 'upcoming') {
    where = { startDate: { gt: now } };
  } else if (filter === 'ongoing') {
    where = { startDate: { lte: now }, endDate: { gte: now } };
  } else if (filter === 'completed') {
    where = { endDate: { lt: now } };
  }

  const courses = await this.prisma.course.findMany({
    where,
    orderBy: { startDate: 'asc' },
    include: {
      enrollments: {
        include: {
          student: true, 
        },
      },
      instructor: true, 
    },
  });

  return {
    statusCode: 200,
    message: 'Courses retrieved successfully',
    data: courses.map(c => new CourseEntity(c)), // agar CourseEntity enrollmentsni ham qamrab olishi kerak bo'lsa, constructorga qo'shish kerak
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

    
      // Transaction bilan ishlash
    const updated = await this.prisma.$transaction(async (tx) => {
      // 1️⃣ Avval mavjud kursni tekshirish
      const course = await tx.course.findUnique({ where: { id } });
      if (!course) throw new NotFoundException('Course not found');

      // 2️⃣ Instructor tekshiruvi (agar instructorId berilgan bo‘lsa)
      if (dto.instructorId !== undefined) {
        const instructor = await this.instructorService.findOne(dto.instructorId);
        if (!instructor) throw new NotFoundException('Instructor not found');
      }

      if(dto.capacity !== undefined){
        if (dto.capacity <= 0) throw new ConflictException('Capacity must be a positive number');
        if (dto.capacity < course.capacity-course.seatsAvailable) throw new ConflictException(`New capacity (${dto.capacity}) cannot be less than current seats available (${course.seatsAvailable})`)
      }

      // 3️⃣ Capacity o‘zgargan bo‘lsa, seatsAvailable qayta hisoblash
      const currentEnrolled = course.capacity - course.seatsAvailable;
      const newSeatsAvailable = dto.capacity !== undefined
        ? Math.max(0, dto.capacity - currentEnrolled)
        : course.seatsAvailable;

      // 4️⃣ Update qilish
      const updatedCourse = await tx.course.update({
        where: { id },
        data: {
          title: dto.title ?? course.title,
          description: dto.description ?? course.description,
          startDate: dto.startDate ? new Date(dto.startDate) : course.startDate,
          endDate: dto.endDate ? new Date(dto.endDate) : course.endDate,
          capacity: dto.capacity ?? course.capacity,
          seatsAvailable: newSeatsAvailable,
          instructorId: dto.instructorId ?? course.instructorId,
        },
      });

      // 5️⃣ Logger orqali voqeani yozib qo‘yish
      this.logger.log(
        `Course updated: ${updatedCourse.id}, fields: ${Object.keys(dto).join(', ')}`
      );

      return updatedCourse;
    });

    // 6️⃣ Return response
    return {
      statusCode: 200,
      message: 'Course updated successfully',
      data: updated,
    };
  }



  async remove(id: number) {
    // Tranzaksiyada kurs va barcha enrollmentsni o‘chirib tashlaymiz
    const deleted = await this.prisma.$transaction(async (tx) => {

      await tx.enrollment.deleteMany({ where: { courseId: id } });

      return tx.course.delete({ where: { id } });
    });

    this.logger.log(`Course and its enrollments deleted: ${deleted.id}`);

    return {
      statusCode: 200,
      message: 'Course and all related enrollments deleted successfully',
      data: deleted,
    };
  }

}
