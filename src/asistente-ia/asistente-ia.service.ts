import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AsistenteIaService {
  constructor(private readonly prisma: PrismaService) {}

  async generarMensajeCita(negocioId: number, citaId: number) {
    const cita = await this.prisma.cita.findUnique({
      where: { id: citaId },
      include: {
        cliente: { select: { nombre: true } },
        servicio: { select: { nombre: true, duracionMin: true } },
        profesional: { select: { nombre: true } },
        negocio: { select: { nombre: true } },
      },
    });

    if (!cita || cita.negocioId !== negocioId) {
      throw new NotFoundException('La cita no existe en este negocio');
    }

    const fecha = new Date(cita.fecha).toLocaleString('es-CO', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const prompt =
      `Eres el asistente de la barbería/negocio "${cita.negocio.nombre}". ` +
      `Escribe un mensaje de WhatsApp corto (2 o 3 frases), cálido y en español colombiano neutro, ` +
      `para CONFIRMARLE la cita al cliente. Datos: cliente ${cita.cliente.nombre}, ` +
      `servicio "${cita.servicio.nombre}" (${cita.servicio.duracionMin} min) ` +
      `con ${cita.profesional.nombre}, el ${fecha}. ` +
      `No inventes datos que no te di. Puedes usar un emoji discreto.`;

    const texto = await this.llamarIA(prompt);
    if (texto) {
      return { modo: 'ia', mensaje: texto.trim() };
    }

    return {
      modo: 'simulado',
      mensaje:
        `¡Hola ${cita.cliente.nombre}! 👋 Te confirmamos tu cita en ${cita.negocio.nombre}: ` +
        `${cita.servicio.nombre} con ${cita.profesional.nombre}, el ${fecha}. ` +
        `¡Te esperamos!`,
    };
  }

  private async llamarIA(prompt: string): Promise<string | null> {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return null;
    }

    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
      }),
    });

    if (!res.ok) {
      throw new ServiceUnavailableException(
        'La IA no está disponible en este momento',
      );
    }

    const data: any = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  }
}