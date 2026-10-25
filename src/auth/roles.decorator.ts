import { Reflector } from '@nestjs/core';
import { Rol } from '../generated/prisma/client';

export const Roles = Reflector.createDecorator<Rol[]>();