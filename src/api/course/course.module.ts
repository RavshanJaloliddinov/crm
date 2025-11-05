import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { InstructorService } from '../instructor/instructor.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, InstructorService],
})
export class CourseModule { }
 