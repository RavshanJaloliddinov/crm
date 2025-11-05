import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CourseEntity } from './entities/course.entity';
import { Public } from 'src/common/decorators/public';

@ApiTags('Courses')
@Public()
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({
    status: 201,
    description: 'Course created successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'Course created successfully',
        data: {
          id: 1,
          title: 'JavaScript for Beginners',
          description: 'Learn JS from scratch',
          startDate: '2025-12-01T10:00:00Z',
          endDate: '2026-01-15T18:00:00Z',
          capacity: 30,
          seatsAvailable: 30,
          instructorId: 2
        }
      }
    }
  })
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({
    status: 200,
    description: 'List of all courses',
    schema: {
      example: {
        statusCode: 200,
        message: 'Courses fetched successfully',
        data: [
          {
            id: 1,
            title: 'JavaScript for Beginners',
            description: 'Learn JS from scratch',
            startDate: '2025-12-01T10:00:00Z',
            endDate: '2026-01-15T18:00:00Z',
            capacity: 30,
            seatsAvailable: 30,
            instructorId: 2
          }
        ]
      }
    }
  })
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  @ApiParam({ name: 'id', description: 'Course ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Course fetched successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Course fetched successfully',
        data: {
          id: 1,
          title: 'JavaScript for Beginners',
          description: 'Learn JS from scratch',
          startDate: '2025-12-01T10:00:00Z',
          endDate: '2026-01-15T18:00:00Z',
          capacity: 30,
          seatsAvailable: 30,
          instructorId: 2
        }
      }
    }
  })
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update course info' })
  @ApiParam({ name: 'id', description: 'Course ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Course updated successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Course updated successfully',
        data: {
          id: 1,
          title: 'Advanced JS',
          description: 'Deep dive into JS',
          startDate: '2025-12-01T10:00:00Z',
          endDate: '2026-01-15T18:00:00Z',
          capacity: 40,
          seatsAvailable: 35,
          instructorId: 2
        }
      }
    }
  })
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(Number(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete course' })
  @ApiParam({ name: 'id', description: 'Course ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Course deleted successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Course deleted successfully',
        data: null
      }
    }
  })
  remove(@Param('id') id: string) {
    return this.courseService.remove(Number(id));
  }
}
