import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ActualizarServicioDto {
  @ApiPropertyOptional({ example: 'Corte clásico' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(80, { message: 'El nombre no puede superar 80 caracteres' })
  nombre?: string;

  @ApiPropertyOptional({ example: 30, description: 'Duración en minutos' })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'La duración debe ser de al menos 1 minuto' })
  duracionMin?: number;

  @ApiPropertyOptional({ example: 25000 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
