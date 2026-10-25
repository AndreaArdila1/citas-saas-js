import { Controller, Headers, Post, Req } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Request } from 'express';
import { SuscripcionesService } from './suscripciones.service';

@ApiExcludeController()
@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(private readonly suscripcionesService: SuscripcionesService) {}

  @Post()
  recibir(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') firma: string,
  ) {
    const rawBody = req.rawBody;

    console.log(
      `[Stripe Webhook] Evento recibido | firma=${firma ? 'presente' : 'AUSENTE'} | rawBody=${
        rawBody ? `${rawBody.length} bytes` : 'UNDEFINED'
      }`,
    );

    return this.suscripcionesService.procesarEvento(rawBody as Buffer, firma);
  }
}
