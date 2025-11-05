import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto, UpdateInstructorDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public';

@ApiTags('Instructors')
@Public()
@Controller('instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new instructor' })
  @ApiResponse({
    status: 201,
    description: 'Instructor created successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'Instructor created successfully',
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          bio: 'Expert in JavaScript',
        },
      },
    },
  })
  create(@Body() dto: CreateInstructorDto) {
    return this.instructorService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all instructors' })
  @ApiResponse({
    status: 200,
    description: 'List of instructors',
    schema: {
      example: {
        statusCode: 200,
        message: 'Instructors fetched successfully',
        data: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            bio: 'Expert in JavaScript',
          },
        ],
      },
    },
  })
  findAll() {
    return this.instructorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get instructor by ID' })
  @ApiParam({ name: 'id', description: 'Instructor ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Instructor fetched successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Instructor fetched successfully',
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          bio: 'Expert in JavaScript',
        },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.instructorService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update instructor info' })
  @ApiParam({ name: 'id', description: 'Instructor ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Instructor updated successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Instructor updated successfully',
        data: {
          id: 1,
          name: 'Jane Doe',
          email: 'jane@example.com',
          bio: 'Senior JS Expert',
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: UpdateInstructorDto) {
    return this.instructorService.update(Number(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete instructor' })
  @ApiParam({ name: 'id', description: 'Instructor ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Instructor deleted successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Instructor deleted successfully',
        data: null,
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.instructorService.remove(Number(id));
  }
}
