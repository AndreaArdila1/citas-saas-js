-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('DUENO', 'STAFF', 'CLIENTE');

-- CreateEnum
CREATE TYPE "EstadoCita" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');

-- CreateEnum
CREATE TYPE "EstadoSuscripcion" AS ENUM ('ACTIVA', 'CANCELADA', 'VENCIDA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'CLIENTE',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfiles" (
    "id" SERIAL NOT NULL,
    "telefono" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "perfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "negocios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duenoId" INTEGER NOT NULL,

    CONSTRAINT "negocios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profesionales" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "especialidad" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "negocioId" INTEGER NOT NULL,

    CONSTRAINT "profesionales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "duracionMin" INTEGER NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "negocioId" INTEGER NOT NULL,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicio_profesional" (
    "servicioId" INTEGER NOT NULL,
    "profesionalId" INTEGER NOT NULL,

    CONSTRAINT "servicio_profesional_pkey" PRIMARY KEY ("servicioId","profesionalId")
);

-- CreateTable
CREATE TABLE "citas" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoCita" NOT NULL DEFAULT 'PENDIENTE',
    "notas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "negocioId" INTEGER NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "servicioId" INTEGER NOT NULL,
    "profesionalId" INTEGER NOT NULL,

    CONSTRAINT "citas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suscripciones" (
    "id" SERIAL NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "estado" "EstadoSuscripcion" NOT NULL DEFAULT 'ACTIVA',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "vigenteHasta" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "negocioId" INTEGER NOT NULL,

    CONSTRAINT "suscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuraciones" (
    "id" SERIAL NOT NULL,
    "horaApertura" TEXT NOT NULL DEFAULT '09:00',
    "horaCierre" TEXT NOT NULL DEFAULT '18:00',
    "zonaHoraria" TEXT NOT NULL DEFAULT 'America/Bogota',
    "duracionDefault" INTEGER NOT NULL DEFAULT 30,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "negocioId" INTEGER NOT NULL,

    CONSTRAINT "configuraciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_usuarioId_key" ON "perfiles"("usuarioId");

-- CreateIndex
CREATE INDEX "negocios_duenoId_idx" ON "negocios"("duenoId");

-- CreateIndex
CREATE INDEX "profesionales_negocioId_idx" ON "profesionales"("negocioId");

-- CreateIndex
CREATE INDEX "servicios_negocioId_idx" ON "servicios"("negocioId");

-- CreateIndex
CREATE INDEX "citas_negocioId_idx" ON "citas"("negocioId");

-- CreateIndex
CREATE INDEX "citas_profesionalId_fecha_idx" ON "citas"("profesionalId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "suscripciones_negocioId_key" ON "suscripciones"("negocioId");

-- CreateIndex
CREATE UNIQUE INDEX "configuraciones_negocioId_key" ON "configuraciones"("negocioId");

-- AddForeignKey
ALTER TABLE "perfiles" ADD CONSTRAINT "perfiles_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "negocios" ADD CONSTRAINT "negocios_duenoId_fkey" FOREIGN KEY ("duenoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profesionales" ADD CONSTRAINT "profesionales_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "negocios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicios" ADD CONSTRAINT "servicios_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "negocios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio_profesional" ADD CONSTRAINT "servicio_profesional_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio_profesional" ADD CONSTRAINT "servicio_profesional_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "profesionales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citas" ADD CONSTRAINT "citas_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "negocios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citas" ADD CONSTRAINT "citas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citas" ADD CONSTRAINT "citas_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citas" ADD CONSTRAINT "citas_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "profesionales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "negocios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuraciones" ADD CONSTRAINT "configuraciones_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "negocios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
