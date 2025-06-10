// badge.controller.ts
import { 
  Controller, 
  Post, 
  Body, 
  Res, 
  HttpStatus, 
  Get, 
  Param 
} from '@nestjs/common';
import { Response } from 'express';
import { CrachaService } from './cracha.service';


export class GenerateBadgeDto {
  nome: string;
  cargo: string;
  matricula: string;
  foto?: string;
  qrCodeUrl?: string;
}

@Controller('badge')
export class CrachaController {
  constructor(private readonly badgeGeneratorService: CrachaService) {}

  @Post('generate')
  async generateBadge(
    @Body() badgeData: GenerateBadgeDto,
    @Res() res: Response
  ) {
    try {
      const imageBuffer = await this.badgeGeneratorService.generateBadgeImage(badgeData);
      
      res.set({
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length,
        'Content-Disposition': `attachment; filename="cracha-${badgeData.matricula}.png"`
      });
      
      res.status(HttpStatus.OK).send(imageBuffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao gerar imagem do crachá',
        error: error.message
      });
    }
  }

  @Get('generate/:matricula')
  async generateBadgeByMatricula(
    @Param('matricula') matricula: string,
    @Res() res: Response
  ) {
    try {
      // Aqui você buscaria os dados do funcionário no banco de dados
      // const funcionario = await this.funcionarioService.findByMatricula(matricula);
      
      // Dados de exemplo
      const badgeData = {
        nome: 'João Silva Santos',
        cargo: 'Analista de Sistemas',
        matricula: matricula,
        foto: 'https://via.placeholder.com/150',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + matricula
      };
      
      const imageBuffer = await this.badgeGeneratorService.generateBadgeImage(badgeData);
      
      res.set({
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length,
        'Content-Disposition': `inline; filename="cracha-${matricula}.png"`
      });
      
      res.status(HttpStatus.OK).send(imageBuffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao gerar imagem do crachá',
        error: error.message
      });
    }
  }

  @Post('generate-base64')
  async generateBadgeBase64(@Body() badgeData: GenerateBadgeDto) {
    try {
      const imageBuffer = await this.badgeGeneratorService.generateBadgeImage(badgeData);
      const base64Image = imageBuffer.toString('base64');
      
      return {
        success: true,
        image: `data:image/png;base64,${base64Image}`,
        filename: `cracha-${badgeData.matricula}.png`
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao gerar imagem do crachá',
        error: error.message
      };
    }
  }
}