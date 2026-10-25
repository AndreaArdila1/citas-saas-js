import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CrearNegocioDto {
  @ApiProperty({ example: 'Nombre del negocio' })
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(80, { message: 'El nombre no puede superar 80 caracteres' })
  nombre!: string;

  @ApiPropertyOptional({ example: 'Descripción breve del negocio' })
  @IsOptional()
  @IsString()
  @MaxLength(300, { message: 'La descripción no puede superar 300 caracteres' })
  descripcion?: string;

  @ApiPropertyOptional({ example: '3001234567' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiPropertyOptional({ example: 'Calle X # Y-Z, Ciudad' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  direccion?: string;
}