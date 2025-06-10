// badge-generator.service.ts
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import * as path from 'path';

interface BadgeData {
  nome: string;
  cargo: string;
  matricula: string;
  foto?: string;
  qrCodeUrl?: string;
}

@Injectable()
export class CrachaService {
  private async generateBadgeHTML(data: BadgeData): Promise<string> {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f3f4f6;
            padding: 20px;
          }
          .badge {
            max-width: 340px;
            margin: 0 auto;
            background-color: white;
            border-radius: 24px;
            border: 2px solid #e5e7eb;
            overflow: hidden;
            height: 500px;
          }
          .header {
            background-color: #18416d;
            padding: 32px 24px;
            text-align: center;
          }
          .photo-container {
            width: 96px;
            height: 96px;
            background-color: white;
            border-radius: 50%;
            margin: 0 auto 16px auto;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .photo-inner {
            width: 140px;
            height: 105px;
            background-color: #d1d5db;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .photo {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          }
          .matricula {
            color: white;
            font-size: 14px;
            font-weight: bold;
            margin-top: 8px;
          }
          .main-content {
            padding: 32px 24px;
            text-align: center;
          }
          .nome {
            font-size: 20px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 8px;
          }
          .cargo {
            color: #666;
            font-size: 13px;
            margin-bottom: 32px;
            font-weight: bold;
          }
          .footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 32px;
          }
          .logo-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .logo-inner {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            margin-top: 16px;
          }
          .logo {
            width: 170px;
            height: 68px;
          }
          .qr-container {
            width: 24px;
            height: 24px;
            border: 2px solid #1f2937;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
          }
          .qr-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .qr-code {
            max-width: 95px;
            border-radius: 4px;
            padding: 4px;
          }
          .qr-text {
            font-size: 10px;
            color: #6b7280;
            margin-top: 4px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="badge">
          <!-- Header azul com foto e matrícula -->
          <div class="header">
            <div class="photo-container">
              <div class="photo-inner">
                ${data.foto ? `<img src="${data.foto}" alt="Foto do crachá" class="photo" />` : ''}
              </div>
            </div>
            <p class="matricula">Matrícula ${data.matricula}</p>
          </div>

          <!-- Seção principal com informações -->
          <div class="main-content">
            <h2 class="nome">${data.nome}</h2>
            <p class="cargo">${data.cargo}</p>

            <!-- Footer com logo e QR code -->
            <div class="footer">
              <!-- Logo do Tribunal de Contas -->
              <div class="logo-container">
                <div class="logo-inner">
                  <img
                    src="https://app.tce.ap.gov.br/storage/geral/Cracha.foto/8/tceLogo.svg"
                    alt="Logo TCE-AP"
                    class="logo"
                  />
                </div>
              </div>

              <!-- QR Code -->
              <div class="qr-container">
                ${data.qrCodeUrl ? `
                  <div class="qr-inner">
                    <img
                      src="${data.qrCodeUrl}"
                      alt="QR Code para consulta"
                      class="qr-code"
                    />
                    <div class="qr-text">
                      Escaneie para consultar
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async generateBadgeImage(data: BadgeData): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      
      // Define o viewport para garantir qualidade consistente
      await page.setViewport({
        width: 400,
        height: 600,
        deviceScaleFactor: 2 // Para melhor qualidade da imagem
      });

      const html = await this.generateBadgeHTML(data);
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Captura screenshot da div do crachá
      const element = await page.$('.badge');
      const imageBuffer = await element.screenshot({
        type: 'png',
        encoding: 'binary'
      });

      return imageBuffer as Buffer;
    } finally {
      await browser.close();
    }
  }

  async generateBadgeImageFromUrl(data: BadgeData): Promise<Buffer> {
    // Alternativa usando uma URL temporária
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({
        width: 400,
        height: 600,
        deviceScaleFactor: 2
      });

      const html = await this.generateBadgeHTML(data);
      
      // Cria um arquivo HTML temporário
      const tempDir = path.join(process.cwd(), 'temp');
      await fs.mkdir(tempDir, { recursive: true });
      
      const tempFile = path.join(tempDir, `badge-${Date.now()}.html`);
      await fs.writeFile(tempFile, html);

      await page.goto(`file://${tempFile}`, { waitUntil: 'networkidle0' });

      const element = await page.$('.badge');
      const imageBuffer = await element.screenshot({
        type: 'png',
        encoding: 'binary'
      });

      // Remove o arquivo temporário
      await fs.unlink(tempFile);

      return imageBuffer as Buffer;
    } finally {
      await browser.close();
    }
  }
}