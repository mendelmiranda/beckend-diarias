// src/common/decorators/audit.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const Audit = () => SetMetadata('audit', true);
