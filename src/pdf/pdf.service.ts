import { Injectable } from '@nestjs/common';
import * as pup from 'puppeteer';
import * as http from 'http';

@Injectable()
export class PdfService {
    private urlToBase64(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            http
                .get(url, (res) => {
                    const chunks: Buffer[] = [];
                    res.on('data', (chunk: Buffer) => chunks.push(chunk));
                    res.on('end', () => {
                        const data = Buffer.concat(chunks);
                        const ext = url.split('.').pop()?.split('?')[0] || 'png';
                        const mime =
                            ext === 'jpg' || ext === 'jpeg'
                                ? 'image/jpeg'
                                : ext === 'gif'
                                    ? 'image/gif'
                                    : ext === 'webp'
                                        ? 'image/webp'
                                        : 'image/png';
                        resolve(`data:${mime};base64,${data.toString('base64')}`);
                    });
                })
                .on('error', reject);
        });
    }

    async generatePDF(html: string): Promise<Buffer> {
        const browser = await pup.launch({
            headless: true,
        });

        const page = await browser.newPage();

        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    html, body {
                        width: 100%;
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;

        await page.setContent(fullHtml, { waitUntil: 'load' });
        await page.waitForNetworkIdle();

        const [cecitLogo, recurso6, recurso8] = await Promise.all([
            this.urlToBase64(
                'http://centrodecomercioag.com.ar/wp-content/uploads/2023/07/cecit2023.png',
            ),
            this.urlToBase64(
                'http://centrodecomercioag.com.ar/wp-content/uploads/2025/04/Recurso-6.png',
            ),
            this.urlToBase64(
                'http://centrodecomercioag.com.ar/wp-content/uploads/2025/04/Recurso-8.png',
            ),
        ]);

        const pdf = await page.pdf({
            format: 'A6',
            printBackground: true,
            displayHeaderFooter: true,
            margin: {
                top: '75px',
                bottom: '75px',
                left: '0px',
                right: '0px',
            },
            headerTemplate: `
                <style>body{margin:0;padding:0;}</style>
                <div style="margin:0;padding:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background-color:#151532;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
                    <img style="height:60px;display:block;" src="${cecitLogo}" alt="CeCIT" />
                </div>
            `,
            footerTemplate: `
                <style>body{margin:0;padding:0;}</style>
                <div style="margin:0;padding:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;gap:50px;background-color:#151532;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
                    <img style="height:60px;object-fit:contain;display:block;" src="${recurso6}" alt="Paseo Libertador y Paseo del Centro" />
                    <img style="height:60px;object-fit:contain;display:block;" src="${recurso8}" alt="Nos respaldan: CAME y FEDECOM" />
                </div>
            `,
        });
        await browser.close();
        return Buffer.from(pdf);
    }
}
