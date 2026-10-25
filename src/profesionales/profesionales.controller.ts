import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { UsuarioActual } from '../auth/usuario-actual.decorator';
  import { ProfesionalesService } from './profesionales.service';
  import { CrearProfesionalDto } from './dto/crear-profesional.dto';
  
  @ApiTags('profesionales')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('negocios/:negocioId/profesionales')
  export class ProfesionalesController {
    constructor(private readonly profesionalesService: ProfesionalesService) {}
  
    @Post()
    crear(
      @Param('negocioId', ParseIntPipe) negocioId: number,
      @UsuarioActual() usuario: { id: number },
      @Body() dto: CrearProfesionalDto,
    ) {
      return this.profesionalesService.crear(negocioId, usuario.id, dto);
    }
  
    @Get()
    listar(
      @Param('negocioId', ParseIntPipe) negocioId: number,
      @UsuarioActual() usuario: { id: number },
    ) {
      return this.profesionalesService.listarPorNegocio(negocioId, usuario.id);
    }
  }