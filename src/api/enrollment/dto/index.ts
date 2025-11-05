import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollStudentDto {
    @ApiProperty({ description: 'Talaba ID', example: 1 })
    @IsInt()
    @Min(1)
    studentId: number;

    @ApiProperty({ description: 'Kurs ID', example: 2 })
    @IsInt()
    @Min(1)
    courseId: number;
}

export class UnenrollDto {
    @ApiProperty({ description: 'Enrollment ID', example: 1 })
    @IsInt()
    @Min(1)
    enrollmentId: number;
}

export class CompleteEnrollmentDto {
    @ApiProperty({ description: 'Enrollment ID', example: 1 })
    @IsInt()
    @Min(1)
    enrollmentId: number;
}

