import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoCita } from '../../generated/prisma/enums';
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class ActualizarCitaDto {
  @ApiPropertyOptional({ example: '2026-10-20T15:00:00.000Z' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha no tiene un formato válido' })
  fecha?: string;

  @ApiPropertyOptional({ enum: EstadoCita, example: EstadoCita.CONFIRMADA })
  @IsOptional()
  @IsEnum(EstadoCita, { message: 'El estado de la cita no es válido' })
  estado?: EstadoCita;

  @ApiPropertyOptional({ example: 'Prefiere corte bajo' })
  @IsOptional()
  @IsString()
  @MaxLength(300, { message: 'Las notas no pueden superar 300 caracteres' })
  notas?: string;
}
