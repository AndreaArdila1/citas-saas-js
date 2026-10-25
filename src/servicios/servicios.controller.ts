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
  import { ServiciosService } from './servicios.service';
  import { CrearServicioDto } from './dto/crear-servicio.dto';
  
  @ApiTags('servicios')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('negocios/:negocioId/servicios')
  export class ServiciosController {
    constructor(private readonly serviciosService: ServiciosService) {}
  
    @Post()
    crear(
      @Param('negocioId', ParseIntPipe) negocioId: number,
      @UsuarioActual() usuario: { id: number },
      @Body() dto: CrearServicioDto,
    ) {
      return this.serviciosService.crear(negocioId, usuario.id, dto);
    }
  
    @Get()
    listar(
      @Param('negocioId', ParseIntPipe) negocioId: number,
      @UsuarioActual() usuario: { id: number },
    ) {
      return this.serviciosService.listarPorNegocio(negocioId, usuario.id);
    }
  }