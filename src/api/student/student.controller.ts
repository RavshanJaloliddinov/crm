import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public';

@ApiTags('Students')
@ApiBearerAuth('access-token')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students' })
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID with enrollments' })
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(Number(id));
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get student enrollment history' })
  findHistory(@Param('id') id: string) {
    return this.studentService.findHistory(Number(id));
  }
}
