import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CrearProfesionalDto {
  @ApiProperty({ example: 'Carlos Pérez' })
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(80, { message: 'El nombre no puede superar 80 caracteres' })
  nombre!: string;

  @ApiPropertyOptional({ example: 'Barbería' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  especialidad?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  negocioId!: number;
}
