import { IsString, IsNotEmpty, IsEmail, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
    @ApiProperty({ description: 'Talaba ismi', example: 'Alice Smith' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Talaba emaili', example: 'alice@example.com' })
    @IsEmail()
    email: string;

    @ApiPropertyOptional({ description: 'Ro‘yxatga olish sanasi', example: '2025-11-05T12:00:00Z', default: 'now' })
    @IsOptional()
    @IsDateString()
    enrolledAt?: string;
}
