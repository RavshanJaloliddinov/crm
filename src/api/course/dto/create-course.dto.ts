import { IsString, IsNotEmpty, IsDateString, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
    @ApiProperty({ description: 'Kurs nomi', example: 'JavaScript for Beginners' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Kurs tavsifi', example: 'Learn JS from scratch' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Kurs boshlanish sanasi', example: '2025-12-01T10:00:00Z' })
    @IsDateString()
    startDate: Date;

    @ApiProperty({ description: 'Kurs tugash sanasi', example: '2026-01-15T18:00:00Z' })
    @IsDateString()
    endDate: Date;

    @ApiProperty({ description: 'Kursga qabul qilinadigan maksimal talabalar soni', example: 30, minimum: 1 })
    @IsInt()
    @Min(1)
    capacity: number;

    @ApiPropertyOptional({ description: 'Instructor ID, agar kursga o‘qituvchi tayinlanadigan bo‘lsa', example: 2 })
    @IsOptional()
    @IsInt()
    instructorId?: number;
}
