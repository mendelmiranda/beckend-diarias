import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ViagemEventoService {

    constructor(
        private prisma: PrismaService,){}

        
}
