import { Injectable } from '@nestjs/common';
import { CreateCorrecaoSolicitacaoDto } from './dto/create-correcao_solicitacao.dto';
import { UpdateCorrecaoSolicitacaoDto } from './dto/update-correcao_solicitacao.dto';
import { PrismaService } from 'prisma/prisma.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class CorrecaoSolicitacaoService {
  constructor(private prisma: PrismaService, private emailService: EmailService) { }

  async create(dto: CreateCorrecaoSolicitacaoDto) {
    const data: CreateCorrecaoSolicitacaoDto = {
      ...dto,
      datareg: new Date(),
    }

    this.notifica(dto.solicitacao_id, dto.status, dto.texto);

    return this.prisma.correcao_solicitacao.create({
      data: data,
    });
  }

  async notifica(solicitacaoId: number, status: string, texto: string) {

    const solicitacao = await this.prisma.solicitacao.findFirst({
      where: {
        id: solicitacaoId
      }
    });

    if (status === "AGUARDANDO_CORRECAO") {
      this.emailService.enviarEmail(solicitacaoId, status, solicitacao.login, texto);
    }

    if (status === "CORRIGIDO") {
      this.enviaPresidencia(status, solicitacaoId, "Correção realizada na solicitação.");
    }
  }

  async enviaPresidencia(status: string, solicitacaoId: number, mensagem?: string) {
    this.emailService.enviarEmail(solicitacaoId, status, 'wendell.sacramento', mensagem);
    /* this.emailService.enviarEmail(solicitacaoId, status,'cons.michelhouat');
      this.emailService.enviarEmail(solicitacaoId, status,'antonio.correa');
      this.emailService.enviarEmail(solicitacaoId, status,'luzia.coelho');
      this.emailService.enviarEmail(solicitacaoId, status,'alana.castro'); */
  }


  findAll() {
    return this.prisma.correcao_solicitacao.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} correcaoSolicitacao`;
  }

  carregarSolicitacaoParaCorrecao(idSolicitacao: number) {
    if (isNaN(idSolicitacao)) {
      throw new Error('idSolicitacao não é um número válido.');
    }

    return this.prisma.correcao_solicitacao.findMany({
      where: {
        solicitacao_id: idSolicitacao
      },
      orderBy: [{ id: 'desc' }]
    });
  }

  update(id: number, updateCorrecaoSolicitacaoDto: UpdateCorrecaoSolicitacaoDto) {
    this.notifica(updateCorrecaoSolicitacaoDto.solicitacao_id, updateCorrecaoSolicitacaoDto.status, updateCorrecaoSolicitacaoDto.texto);

    return this.prisma.correcao_solicitacao.update({
      where: { id },
      data: updateCorrecaoSolicitacaoDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} correcaoSolicitacao`;
  }
}
