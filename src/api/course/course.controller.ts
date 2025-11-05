import { Controller, Post, Body, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CourseEntity } from './entities/course.entity';
import { Public } from 'src/common/decorators/public';

@ApiTags('Courses')
@ApiBearerAuth('access-token')
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
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Filter courses by status',
    enum: ['upcoming', 'ongoing', 'completed'],
  })
  @ApiResponse({
    status: 200,
    description: 'List of courses',
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
            instructorId: 2,
          },
        ],
      },
    },
  })
  async findAll(
    @Query('filter') filter?: 'upcoming' | 'ongoing' | 'completed',
  ) {
    const courses = await this.courseService.findAll(filter);
    return courses;
  }



  @Get('with-student')
  @ApiOperation({ summary: 'Get all courses' })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Filter courses by status',
    enum: ['upcoming', 'ongoing', 'completed'],
  })
  @ApiResponse({
    status: 200,
    description: 'List of courses',
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
            instructor: {
              id: 2,
              name: 'John Doe',
              email: 'john@example.com',
            },
            enrollments: [
              {
                id: 1,
                student: {
                  id: 1,
                  name: 'Alice',
                  email: 'alice@example.com',
                },
                enrolledDate: '2025-12-02T10:00:00Z',
                completed: false,
              },
            ],
          },
        ],
      },
    },
  })
  async findAllWithUsers(
    @Query('filter') filter?: 'upcoming' | 'ongoing' | 'completed',
  ) {
    return this.courseService.findAllWithUsers(filter);
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
