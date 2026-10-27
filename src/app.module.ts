import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { NegociosModule } from './negocios/negocios.module';
import { PerfilesModule } from './perfiles/perfiles.module';
import { ProfesionalesModule } from './profesionales/profesionales.module';
import { ServiciosModule } from './servicios/servicios.module';
import { CitasModule } from './citas/citas.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { SuscripcionesModule } from './suscripciones/suscripciones.module';
import { AsistenteIaModule } from './asistente-ia/asistente-ia.module';

@Module({
  imports: [
    // Infraestructura
    PrismaModule,
    // Autenticación
    AuthModule,
    // Negocio (tenant)
    NegociosModule,
    // Dominio
    PerfilesModule,
    ConfiguracionModule,
    ServiciosModule,
    ProfesionalesModule,
    CitasModule,
    // Monetización e IA
    SuscripcionesModule,
    AsistenteIaModule,
  ],
})
export class AppModule {}