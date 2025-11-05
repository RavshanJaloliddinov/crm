import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInstructorDto {
    @ApiProperty({ description: 'O‘qituvchi ismi', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'O‘qituvchi emaili', example: 'john@example.com' })
    @IsEmail()
    email: string;

    @ApiPropertyOptional({ description: 'O‘qituvchi haqida qisqa ma’lumot', example: 'Frontend expert' })
    @IsOptional()
    @IsString()
    bio?: string;
}
