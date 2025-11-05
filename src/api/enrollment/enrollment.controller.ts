import { Controller, Post, Body, Get } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollStudentDto, UnenrollDto, CompleteEnrollmentDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) { }

  @Post('enroll')
  @ApiOperation({ summary: 'Enroll a student to a course' })
  @ApiResponse({
    status: 201,
    description: 'Student enrolled successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'Student enrolled successfully',
        data: {
          id: 1,
          studentId: 1,
          courseId: 2,
          enrolledDate: '2025-12-01T10:00:00Z',
          completed: false,
          completionDate: null,
        },
      },
    },
  })
  enroll(@Body() dto: EnrollStudentDto) {
    return this.enrollmentService.enroll(dto);
  }

  @Post('unenroll')
  @ApiOperation({ summary: 'Cancel an enrollment' })
  @ApiResponse({
    status: 200,
    description: 'Enrollment canceled successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Enrollment canceled successfully',
        data: null,
      },
    },
  })
  unenroll(@Body() dto: UnenrollDto) {
    return this.enrollmentService.unenroll(dto);
  }

  @Post('complete')
  @ApiOperation({ summary: 'Mark an enrollment as completed' })
  @ApiResponse({
    status: 200,
    description: 'Enrollment completed successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Enrollment completed successfully',
        data: {
          id: 1,
          studentId: 1,
          courseId: 2,
          enrolledDate: '2025-12-01T10:00:00Z',
          completed: true,
          completionDate: '2025-12-15T14:00:00Z',
        },
      },
    },
  })
  complete(@Body() dto: CompleteEnrollmentDto) {
    return this.enrollmentService.complete(dto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active (ongoing) enrollments' })
  @ApiResponse({
    status: 200,
    description: 'List of active enrollments',
    schema: {
      example: {
        statusCode: 200,
        message: 'Active enrollments fetched successfully',
        data: [
          {
            id: 1,
            studentId: 1,
            courseId: 2,
            enrolledDate: '2025-12-01T10:00:00Z',
            completed: false,
            completionDate: null,
          },
        ],
      },
    },
  })
  getActiveEnrollments() {
    return this.enrollmentService.getActiveEnrollments();
  }
}
