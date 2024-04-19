// src/common/middleware/user.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class UserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    
    const authHeader = req.headers.warning;

        

    if (authHeader) {
      const nome = authHeader;      
      
      try {

        //console.log(token['cpf']);
        
       /*  const decoded = jwt.verify(token, 'Pcy8Z6UpMY0fLaXXXa2Hj_lpUMeshiG6slVaQVoe9Zk'); // Substitua 'seuSecret' pelo seu segredo de JWT real
        req['user'] = decoded; */

        req['user'] = nome;
        
      } catch (err) {
        console.error('Erro na verificação do JWT:', err.message);
      }
    }
    
    next();
  }




}
