import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { Plan, EstadoSuscripcion } from '../generated/prisma/client';

@Injectable()
export class SuscripcionesService {
  private readonly stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
  );

  constructor(private readonly prisma: PrismaService) {}

  private async verificarNegocioPropio(negocioId: number, duenoId: number) {
    const negocio = await this.prisma.negocio.findUnique({
      where: { id: negocioId },
    });
    if (!negocio) {
      throw new NotFoundException('El negocio no existe');
    }
    if (negocio.duenoId !== duenoId) {
      throw new ForbiddenException('Este negocio no es tuyo');
    }
    return negocio;
  }

  async estado(negocioId: number, duenoId: number) {
    await this.verificarNegocioPropio(negocioId, duenoId);
    return this.prisma.suscripcion.findUnique({ where: { negocioId } });
  }

  async crearCheckout(negocioId: number, duenoId: number) {
    const negocio = await this.verificarNegocioPropio(negocioId, duenoId);

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `AgendaFácil PRO — ${negocio.nombre}` },
            unit_amount: 900,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.APP_URL}/suscripcion-ok`,
      cancel_url: `${process.env.APP_URL}/suscripcion-cancelada`,
      metadata: { negocioId: String(negocioId) },
    });

    return { url: session.url };
  }

  async procesarEvento(rawBody: Buffer, firma: string) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';

    let evento: Stripe.Event;
    try {
      evento = this.stripe.webhooks.constructEvent(rawBody, firma, secret);
    } catch (error) {
      console.error(
        `[Stripe Webhook] Firma inválida: ${(error as Error).message}`,
      );
      throw new BadRequestException('Firma de webhook inválida');
    }

    console.log(
      `[Stripe Webhook] Evento verificado: ${evento.id} (${evento.type})`,
    );

    if (evento.type === 'checkout.session.completed') {
      const session = evento.data.object;
      const negocioId = Number(session.metadata?.negocioId);

      const customerId =
        typeof session.customer === 'string'
          ? session.customer
          : (session.customer?.id ?? 'n/a');
      const subscriptionId =
        typeof session.subscription === 'string'
          ? session.subscription
          : (session.subscription?.id ?? 'n/a');

      console.log(
        `[Stripe Webhook] checkout.session.completed | metadata.negocioId=${session.metadata?.negocioId ?? 'ausente'} | customer=${customerId} | subscription=${subscriptionId}`,
      );

      if (negocioId) {
        try {
          await this.prisma.suscripcion.update({
            where: { negocioId },
            data: {
              plan: Plan.PRO,
              estado: EstadoSuscripcion.ACTIVA,
              stripeCustomerId: (session.customer as string) ?? null,
              stripeSubscriptionId: (session.subscription as string) ?? null,
              vigenteHasta: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });
          console.log(
            `[Stripe Webhook] Suscripción actualizada a PRO para negocio ${negocioId}`,
          );
        } catch (error) {
          console.error(
            `[Stripe Webhook] No se pudo actualizar la suscripción del negocio ${negocioId}: ${(error as Error).message}`,
          );
        }
      } else {
        console.warn(
          '[Stripe Webhook] metadata.negocioId ausente o inválido; no se actualiza nada (¿evento de prueba sin metadata?)',
        );
      }
    }

    return { recibido: true };
  }
}
