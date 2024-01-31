import { assinatura, solicitacao } from "@prisma/client";

export class CreateAprovacaoDefinitivaDto {
    
  solicitacao_id: never; 
  //solicitacao: solicitacao;

  assinatura_id: never;
  //assinatura: assinatura;

  datareg: Date; 

}


/* assinatura_id Int
  assinatura    assinatura   @relation(fields: [assinatura_id], references: [id], onDelete: Cascade)
  datareg       DateTime     @default(now()) @db.Timestamptz(3)
  
  solicitacao   solicitacao? @relation(fields: [solicitacaoId], references: [id])
  solicitacaoId Int? */
