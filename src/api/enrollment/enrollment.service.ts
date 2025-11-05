import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnrollStudentDto, UnenrollDto, CompleteEnrollmentDto } from './dto';
import { EnrollmentEntity } from './entities/enrollment.entity';
import { CourseEntity } from '../course/entities/course.entity';

@Injectable()
export class EnrollmentService {
  constructor(private readonly prisma: PrismaService) { }

  // Talabani kursga yozish
  async enroll(dto: EnrollStudentDto) {
    
    const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
    if (!course) throw new NotFoundException('Course not found');

    const student = await this.prisma.student.findUnique({ where: { id: dto.studentId } });
    if (!student) throw new NotFoundException('Student not found');

    
    const courseEntity = new CourseEntity({ ...course });
    if (courseEntity.seatsAvailable <= 0) throw new ConflictException('Kursda bo‘sh o‘rin qolmagan');

    const existingEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId: dto.studentId,
        courseId: dto.courseId,
      },
    });
  
    if (existingEnrollment) {
      throw new ConflictException('Student already enrolled in this course');
    }
    
    const enrollment = await this.prisma.$transaction(async (prisma) => {
      const newEnrollment = await prisma.enrollment.create({
        data: {
          studentId: dto.studentId,
          courseId: dto.courseId,
          enrolledDate: new Date(),
          completed: false,
        },
      });

      // SeatsAvailable kamaytirish
      courseEntity.enrollStudent();
      await prisma.course.update({
        where: { id: dto.courseId },
        data: { seatsAvailable: courseEntity.seatsAvailable },
      });

      return newEnrollment;
    });

    return {
      statusCode: 201,
      message: 'Student enrolled successfully',
      data: enrollment,
    };
  }


  async unenroll(dto: UnenrollDto) {
    const enrollment = await this.prisma.enrollment.findUnique({ where: { id: dto.enrollmentId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    if (enrollment.completed) throw new ConflictException('Yakunlangan enrollmentni bekor qilib bo‘lmaydi');

    const course = await this.prisma.course.findUnique({ where: { id: enrollment.courseId } });
    if (!course) throw new NotFoundException('Course not found');

    const courseEntity = new CourseEntity({ ...course });
    courseEntity.unenrollStudent();

    await this.prisma.$transaction(async (prisma) => {
      await prisma.enrollment.delete({ where: { id: dto.enrollmentId } });
      await prisma.course.update({
        where: { id: enrollment.courseId },
        data: { seatsAvailable: courseEntity.seatsAvailable },
      });
    });

    return {
      statusCode: 200,
      message: 'Enrollment canceled successfully',
      data: null,
    };
  }

  // Enrollmentni yakunlash
  async complete(dto: CompleteEnrollmentDto) {
    const enrollment = await this.prisma.enrollment.findUnique({ where: { id: dto.enrollmentId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    const enrollmentEntity = new EnrollmentEntity({ ...enrollment });
    enrollmentEntity.complete();

    const updated = await this.prisma.enrollment.update({
      where: { id: dto.enrollmentId },
      data: {
        completed: enrollmentEntity.completed,
        completionDate: enrollmentEntity.completionDate,
      },
    });

    return {
      statusCode: 200,
      message: 'Enrollment completed successfully',
      data: updated,
    };
  }


async getEnrollments(isCompleted?: 'true' | 'false') {
  const completed = isCompleted === 'true' ? true : isCompleted === 'false' ? false : undefined;

  const enrollments = await this.prisma.enrollment.findMany({
    where: completed !== undefined ? { completed } : {},
  });

  return {
    statusCode: 200,
    message: 'Enrollments fetched successfully',
    data: enrollments,
  };
}

}
