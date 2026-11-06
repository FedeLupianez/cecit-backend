import {
    BadRequestException,
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VouchersEntity } from '../entities/vouchers/vouchers.entity';
import PDFDocument from 'pdfkit';
import { PinoLogger } from 'nestjs-pino';
import { createReadStream, ReadStream } from 'fs';
import { pipeline } from 'stream/promises';

export interface InvoiceCustomer {
    id: string;
    name: string;
    lastname: string;
    dni: string;
}

export interface InvoiceProvider {
    name: string;
    logo?: string;
    address?: string;
}

export interface InvoiceItem {
    title: string;
    description?: string;
    image?: string;
    startDate?: Date | null;
    endDate?: Date | null;
}

export interface InvoiceData {
    number: string;
    issueDate?: Date | null;
    deliveryDate?: Date | null;
    status?: string;
    customer: InvoiceCustomer;
    provider: InvoiceProvider;
    item: InvoiceItem;
}

const STATUS_LABELS: Record<string, string> = {
    PENDING: 'Pendiente',
    DELIVERED: 'Entregado',
    EXPIRED: 'Vencido',
};

const STATUS_COLORS: Record<string, { text: string; bg: string }> = {
    PENDING: { text: '#b45309', bg: '#fef3c7' },
    DELIVERED: { text: '#15803d', bg: '#dcfce7' },
    EXPIRED: { text: '#b91c1c', bg: '#fee2e2' },
};

/*
 * Imágenes fijas del layout (header/footer). Se descargan y cachean
 * en memoria con TTL largo. La base URL se toma de FRONT_URL del .env.
 */
const STATIC_IMAGE_PATHS = {
    cecitLogo: '/logo_sin_texto.png',
    recurso6: '/empresas.png',
    recurso8: '/Paseos.png',
} as const;

const FETCH_TIMEOUT_MS = 5000;
const STATIC_IMAGE_TTL_MS = 24 * 60 * 60 * 1000;
const DYNAMIC_IMAGE_TTL_MS = 6 * 60 * 60 * 1000;
const MAX_CACHED_IMAGES = 100;
const MAX_IMAGE_BYTES = 2_500_000;

interface CachedImage {
    data: Buffer;
    expiresAt: number;
}

interface ImageDimensions {
    width: number;
    height: number;
}

/* Colores del diseño original */
const DARK_BLUE = '#151532';
const LIGHT_GRAY = '#e5e7eb';
const MEDIUM_GRAY = '#6b7280';
const DARK_GRAY = '#374151';
const VERY_DARK = '#111827';
const WHITE = '#ffffff';
const LIGHT_BG = '#f9fafb';
const VERY_LIGHT_BG = '#f3f4f6';

/* Dimensiones A6 en puntos (1pt = 1/72 inch). A6 = 105mm x 148mm */
const A6_WIDTH = 297.64;  // 105mm
const A6_HEIGHT = 419.53; // 148mm
const MARGIN = 12;
const CONTENT_WIDTH = A6_WIDTH - MARGIN * 2;

@Injectable()
export class PdfService implements OnModuleInit, OnModuleDestroy {
    private readonly imageCache = new Map<string, CachedImage>();
    private readonly inflightFetches = new Map<string, Promise<Buffer>>();
    private staticImageBuffers: Map<string, Buffer> = new Map();
    private staticImageDims: Map<string, ImageDimensions> = new Map();
    private fontsReady = false;

    constructor(
        @InjectRepository(VouchersEntity)
        private readonly vouchersRepository: Repository<VouchersEntity>,
        private readonly configService: ConfigService,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(PdfService.name);
    }

    onModuleInit() {
        void this.warmup().catch((e) =>
            this.logger.warn(`PDF warmup failed: ${e?.message ?? e}`),
        );
    }

    async onModuleDestroy() {
        this.imageCache.clear();
        this.inflightFetches.clear();
        this.staticImageBuffers.clear();
        this.staticImageDims.clear();
    }

    private async warmup(): Promise<void> {
        await this.getStaticImages();
        this.registerFonts();
    }

    private registerFonts(): void {
        if (this.fontsReady) return;
        // pdfkit has built-in fonts: Helvetica, Times-Roman, Courier, etc.
        // We use Helvetica as the main font (similar to Segoe UI/Arial)
        this.fontsReady = true;
    }

    private escapeText(value: string): string {
        return String(value ?? '').trim();
    }

    private formatDate(date?: Date | string | null): string {
        if (!date) return '—';

        if (typeof date === 'string') {
            const m = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (m) return `${m[3]}/${m[2]}/${m[1]}`;
        }

        const d = date instanceof Date ? date : new Date(date);

        if (isNaN(d.getTime())) return '—';

        const dd = String(d.getUTCDate()).padStart(2, '0');
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');

        return `${dd}/${mm}/${d.getUTCFullYear()}`;
    }

    private getStatusStyle(status: string): { label: string; textColor: string; bgColor: string } {
        const statusKey = String(status ?? '').toUpperCase();
        const label = STATUS_LABELS[statusKey] ?? this.escapeText(status);
        const colors = STATUS_COLORS[statusKey] ?? { text: DARK_GRAY, bg: VERY_LIGHT_BG };
        return { label, textColor: colors.text, bgColor: colors.bg };
    }

    private async tryImage(url?: string): Promise<Buffer | null> {
        if (!url) return null;
        try {
            return await this.urlToBuffer(url, DYNAMIC_IMAGE_TTL_MS);
        } catch (e) {
            this.logger.warn(`Could not load image ${url}: ${e?.message ?? e}`);
            return null;
        }
    }

    private getStaticImagesUrls(): { cecitLogo: string; recurso6: string; recurso8: string } {
        const frontUrl = this.configService.get<string>('FRONT_URL', 'https://centrodecomercioag.com.ar');
        return {
            cecitLogo: `${frontUrl}${STATIC_IMAGE_PATHS.cecitLogo}`,
            recurso6: `${frontUrl}${STATIC_IMAGE_PATHS.recurso6}`,
            recurso8: `${frontUrl}${STATIC_IMAGE_PATHS.recurso8}`,
        };
    }

    private async getStaticImages(): Promise<void> {
        const urls = this.getStaticImagesUrls();
        const [cecitLogo, recurso6, recurso8] = await Promise.all([
            this.urlToBuffer(urls.cecitLogo, STATIC_IMAGE_TTL_MS),
            this.urlToBuffer(urls.recurso6, STATIC_IMAGE_TTL_MS),
            this.urlToBuffer(urls.recurso8, STATIC_IMAGE_TTL_MS),
        ]);
        this.staticImageBuffers.set('cecitLogo', cecitLogo);
        this.staticImageBuffers.set('recurso6', recurso6);
        this.staticImageBuffers.set('recurso8', recurso8);

        // Pre-calculate dimensions
        for (const [key, buf] of this.staticImageBuffers) {
            this.staticImageDims.set(key, this.getImageDimensions(buf));
        }
    }

    private getImageDimensions(buffer: Buffer): ImageDimensions {
        // Quick PNG/JPEG dimension extraction without full decode
        // PNG: bytes 16-23 contain width/height (big-endian)
        // JPEG: more complex, fallback to defaults
        if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
            const width = buffer.readUInt32BE(16);
            const height = buffer.readUInt32BE(20);
            return { width, height };
        }
        // JPEG SOI marker
        if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
            // Simplified: scan for SOF marker
            let i = 2;
            while (i < buffer.length - 1) {
                if (buffer[i] === 0xFF && buffer[i + 1] >= 0xC0 && buffer[i + 1] <= 0xCF && buffer[i + 1] !== 0xC4 && buffer[i + 1] !== 0xC8 && buffer[i + 1] !== 0xCC) {
                    const height = buffer.readUInt16BE(i + 5);
                    const width = buffer.readUInt16BE(i + 7);
                    return { width, height };
                }
                i++;
            }
        }
        return { width: 100, height: 100 }; // fallback
    }

    private getFromCache(url: string): Buffer | null {
        const cached = this.imageCache.get(url);
        if (!cached) return null;
        if (cached.expiresAt < Date.now()) {
            this.imageCache.delete(url);
            return null;
        }
        this.imageCache.delete(url);
        this.imageCache.set(url, cached);
        return cached.data;
    }

    private setCache(url: string, data: Buffer, ttlMs: number): void {
        if (this.imageCache.has(url)) this.imageCache.delete(url);
        while (this.imageCache.size >= MAX_CACHED_IMAGES) {
            const oldest = this.imageCache.keys().next();
            if (oldest.done) break;
            this.imageCache.delete(oldest.value);
        }
        this.imageCache.set(url, { data, expiresAt: Date.now() + ttlMs });
    }

    private async urlToBuffer(url: string, ttlMs: number = DYNAMIC_IMAGE_TTL_MS): Promise<Buffer> {
        const normalized = url?.trim();
        if (!normalized) throw new Error('Empty image URL');

        const cached = this.getFromCache(normalized);
        if (cached) return cached;

        const inflight = this.inflightFetches.get(normalized);
        if (inflight) return inflight;

        const task = this.fetchImageAsBuffer(normalized).then((data) => {
            this.setCache(normalized, data, ttlMs);
            return data;
        });

        this.inflightFetches.set(normalized, task);
        try {
            return await task;
        } finally {
            this.inflightFetches.delete(normalized);
        }
    }

    private async fetchImageAsBuffer(url: string): Promise<Buffer> {
        const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
        if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);

        const mime = (res.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
        if (!mime.startsWith('image/')) this.logger.warn(`Unexpected content-type "${mime}" for ${url}`);

        const declared = Number(res.headers.get('content-length'));
        if (Number.isFinite(declared) && declared > MAX_IMAGE_BYTES) {
            throw new Error(`Image too large (${declared} bytes): ${url}`);
        }

        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length === 0) throw new Error(`Empty image: ${url}`);
        if (buf.length > MAX_IMAGE_BYTES) throw new Error(`Image too large (${buf.length} bytes): ${url}`);

        // Validate image format (pdfkit only supports JPEG and PNG)
        if (!this.isSupportedImageFormat(buf)) {
            throw new Error(`Unsupported image format for ${url}`);
        }

        return buf;
    }

    private isSupportedImageFormat(buf: Buffer): boolean {
        // JPEG: FF D8 FF
        if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
            && buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a) return true;
        return false;
    }

    async generateVoucherPDF(token: string): Promise<Buffer> {
        this.logger.debug(`Generating PDF for voucher: ${token}`);

        if (!token) throw new BadRequestException('Token does not exists');

        const voucher = await this.vouchersRepository.findOne({
            where: { token },
            relations: {
                account: { user: true } as any,
                benefit: { partner: { directions: true } },
            },
        });

        if (!voucher) throw new BadRequestException('Voucher does not exists');

        return await this.generateInvoicePDF({
            number: voucher.token,
            issueDate: voucher.application_date,
            deliveryDate: voucher.delivery_date,
            status: voucher.status,
            customer: {
                id: voucher.account.id_account,
                name: voucher.account.user.name,
                lastname: voucher.account.user.lastname,
                dni: voucher.account.user.dni,
            },
            provider: {
                name: voucher.benefit.partner.name,
                logo: voucher.benefit.partner.logo,
                address: (voucher.benefit.partner.directions ?? [])
                    .map((d) => d.direction)
                    .join(', '),
            },
            item: {
                title: voucher.benefit.title,
                description: voucher.benefit.description,
                image: voucher.benefit.image,
                startDate: voucher.benefit.start_date,
                endDate: voucher.benefit.end_date,
            },
        });
    }

    async generateInvoicePDF(invoice: InvoiceData): Promise<Buffer> {
        this.logger.debug(`Generating invoice PDF ${invoice.number}`);

        const [providerLogo, itemImage] = await Promise.all([
            this.tryImage(invoice.provider.logo),
            this.tryImage(invoice.item.image),
        ]);

        return await this.generatePDF(invoice, providerLogo, itemImage);
    }

    private async generatePDF(
        invoice: InvoiceData,
        providerLogo: Buffer | null,
        itemImage: Buffer | null,
    ): Promise<Buffer> {
        const doc = new PDFDocument({
            size: 'A6',
            margin: 0,
            autoFirstPage: true,
            info: {
                Title: `Cupón ${invoice.number}`,
                Author: 'CeCIT',
            },
        });

        const buffers: Buffer[] = [];
        doc.on('data', (chunk) => buffers.push(chunk));

        // Wait for PDF generation to complete
        const done = new Promise<Buffer>((resolve, reject) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
        });

        // Register fonts
        this.registerFonts();

        // Draw the voucher
        await this.drawVoucher(doc, invoice, providerLogo, itemImage);

        doc.end();
        return done;
    }

    private async drawVoucher(
        doc: PDFKit.PDFDocument,
        invoice: InvoiceData,
        providerLogo: Buffer | null,
        itemImage: Buffer | null,
    ): Promise<void> {
        let y = MARGIN;

        // ============================================================
        // HEADER - Dark blue bar with CeCIT logo
        // ============================================================
        const headerHeight = 50;
        doc.rect(0, 0, A6_WIDTH, headerHeight).fill(DARK_BLUE);

        const cecitLogo = this.staticImageBuffers.get('cecitLogo');
        if (cecitLogo) {
            const dims = this.staticImageDims.get('cecitLogo') || { width: 200, height: 46 };
            const logoHeight = 36;
            const logoWidth = (dims.width / dims.height) * logoHeight;
            const logoX = (A6_WIDTH - logoWidth) / 2;
            doc.image(cecitLogo, logoX, (headerHeight - logoHeight) / 2, { width: logoWidth, height: logoHeight });
        }

        y = headerHeight + 10;

        // ============================================================
        // TITLE ROW: "Comprobante" + voucher number box
        // ============================================================
        doc.font('Helvetica-Bold').fontSize(14).fillColor(DARK_BLUE).text('Comprobante', MARGIN, y);
        const subY = y + 18;
        doc.font('Helvetica').fontSize(7).fillColor(MEDIUM_GRAY)
            .text('Canje de beneficio · CeCIT', MARGIN, subY, { characterSpacing: 0.5 });

        // Voucher number box (right side)
        const numBoxWidth = 100;
        const numBoxHeight = 30;
        const numBoxX = A6_WIDTH - MARGIN - numBoxWidth;
        const numBoxY = y - 2;

        doc.roundedRect(numBoxX, numBoxY, numBoxWidth, numBoxHeight, 4).fill(DARK_BLUE);
        doc.font('Helvetica').fontSize(6).fillColor(WHITE).opacity(0.8)
            .text('Nº', numBoxX, numBoxY + 4, { width: numBoxWidth, align: 'center', characterSpacing: 1 });
        doc.font('Helvetica-Bold').fontSize(12).fillColor(WHITE).opacity(1)
            .text(this.escapeText(invoice.number), numBoxX, numBoxY + 13, { width: numBoxWidth, align: 'center', characterSpacing: 1.5 });

        y = subY + 14;

        // Separator line
        doc.moveTo(MARGIN, y).lineTo(A6_WIDTH - MARGIN, y).strokeColor(DARK_BLUE).lineWidth(2).stroke();
        y += 10;

        // ============================================================
        // TWO CARDS: Socio | Comercio
        // ============================================================
        const cardGap = 8;
        const cardWidth = (CONTENT_WIDTH - cardGap) / 2;
        const cardX1 = MARGIN;
        const cardX2 = MARGIN + cardWidth + cardGap;
        const cardLabelSize = 7;
        const cardValueSize = 8;
        const cardLineHeight = 12;

        // Calculate card heights
        const socioLines = 3; // Nombre, DNI, Legajo
        const comercioLines = providerLogo ? 4 : 3; // Logo, Razón social, Dirección (logo takes extra space)
        const cardHeight = Math.max(
            20 + socioLines * cardLineHeight,
            20 + comercioLines * cardLineHeight + (providerLogo ? 30 : 0)
        );

        // Card backgrounds
        doc.roundedRect(cardX1, y, cardWidth, cardHeight, 4).strokeColor(LIGHT_GRAY).lineWidth(1).stroke();
        doc.roundedRect(cardX2, y, cardWidth, cardHeight, 4).strokeColor(LIGHT_GRAY).lineWidth(1).stroke();

        let cardY = y + 6;

        // --- CARD 1: SOCIO ---
        doc.font('Helvetica-Bold').fontSize(cardLabelSize).fillColor(DARK_BLUE)
            .text('SOCIO', cardX1 + 6, cardY, { characterSpacing: 1 });
        cardY += 14;

        const socioData = [
            { label: 'Nombre:', value: `${invoice.customer.name} ${invoice.customer.lastname}` },
            { label: 'DNI:', value: invoice.customer.dni },
            { label: 'Legajo:', value: invoice.customer.id },
        ];

        for (const field of socioData) {
            doc.font('Helvetica').fontSize(6.5).fillColor(MEDIUM_GRAY)
                .text(field.label, cardX1 + 6, cardY, { width: 45 });
            doc.font('Helvetica').fontSize(cardValueSize).fillColor(VERY_DARK)
                .text(this.escapeText(field.value), cardX1 + 52, cardY, { width: cardWidth - 60 });
            cardY += cardLineHeight;
        }

        // --- CARD 2: COMERCIO ---
        let cardY2 = y + 6;
        doc.font('Helvetica-Bold').fontSize(cardLabelSize).fillColor(DARK_BLUE)
            .text('COMERCIO', cardX2 + 6, cardY2, { characterSpacing: 1 });
        cardY2 += 14;

        // Provider logo
        if (providerLogo) {
            const logoDims = this.getImageDimensions(providerLogo);
            const maxLogoWidth = cardWidth - 12;
            const maxLogoHeight = 26;
            const scale = Math.min(maxLogoWidth / logoDims.width, maxLogoHeight / logoDims.height);
            const logoW = logoDims.width * scale;
            const logoH = logoDims.height * scale;
            doc.image(providerLogo, cardX2 + (cardWidth - logoW) / 2, cardY2, { width: logoW, height: logoH });
            cardY2 += logoH + 6;
        }

        const comercioData = [
            { label: 'Razón social:', value: invoice.provider.name },
            { label: 'Dirección:', value: invoice.provider.address || '—' },
        ];

        for (const field of comercioData) {
            doc.font('Helvetica').fontSize(6.5).fillColor(MEDIUM_GRAY)
                .text(field.label, cardX2 + 6, cardY2, { width: 55 });
            doc.font('Helvetica').fontSize(cardValueSize).fillColor(VERY_DARK)
                .text(this.escapeText(field.value), cardX2 + 62, cardY2, { width: cardWidth - 70 });
            cardY2 += cardLineHeight;
        }

        y = y + cardHeight + 10;

        // ============================================================
        // DETAIL TABLE: Benefit info with thumbnail
        // ============================================================
        const tableTop = y;
        const tableWidth = CONTENT_WIDTH;
        const thumbSize = 52;
        const thumbX = MARGIN;
        const contentX = MARGIN + thumbSize + 8;
        const contentWidth = tableWidth - thumbSize - 8;

        // Table header
        doc.rect(MARGIN, y, tableWidth, 22).fill(DARK_BLUE);
        doc.font('Helvetica-Bold').fontSize(7).fillColor(WHITE)
            .text('DETALLE DEL BENEFICIO', MARGIN + 8, y + 7, { characterSpacing: 1 });
        y += 22;

        // Thumbnail area
        const thumbY = y + 4;
        doc.roundedRect(thumbX, thumbY, thumbSize, thumbSize, 4).strokeColor(LIGHT_GRAY).lineWidth(1).stroke();

        if (itemImage) {
            const imgDims = this.getImageDimensions(itemImage);
            const scale = Math.min((thumbSize - 2) / imgDims.width, (thumbSize - 2) / imgDims.height);
            const imgW = imgDims.width * scale;
            const imgH = imgDims.height * scale;
            doc.image(itemImage, thumbX + (thumbSize - imgW) / 2, thumbY + (thumbSize - imgH) / 2, { width: imgW, height: imgH });
        } else {
            const initial = this.escapeText(invoice.item.title.charAt(0).toUpperCase());
            doc.font('Helvetica-Bold').fontSize(14).fillColor(MEDIUM_GRAY)
                .text(initial, thumbX, thumbY + 14, { width: thumbSize, align: 'center' });
        }

        // Content next to thumbnail
        let contentY = thumbY;

        doc.font('Helvetica-Bold').fontSize(9).fillColor(DARK_BLUE)
            .text(this.escapeText(invoice.item.title), contentX, contentY, { width: contentWidth });
        contentY += 16;

        if (invoice.item.description) {
            doc.font('Helvetica').fontSize(7.5).fillColor(DARK_GRAY)
                .text(this.escapeText(invoice.item.description), contentX, contentY, { width: contentWidth });
            contentY += 18;
        }

        const startStr = this.formatDate(invoice.item.startDate);
        const endStr = this.formatDate(invoice.item.endDate);
        doc.font('Helvetica').fontSize(6.5).fillColor(MEDIUM_GRAY)
            .text('Vigencia:', contentX, contentY, { width: 40, continued: true });
        doc.font('Helvetica').fontSize(6.5).fillColor(DARK_GRAY)
            .text(`${startStr} al ${endStr}`, contentX + 40, contentY, { width: contentWidth - 40 });

        const rowHeight = Math.max(thumbSize + 8, contentY - thumbY + 10);
        y += rowHeight;

        // Bottom border
        doc.moveTo(MARGIN, y).lineTo(A6_WIDTH - MARGIN, y).strokeColor(LIGHT_GRAY).lineWidth(1).stroke();
        y += 10;

        // ============================================================
        // VALIDATION CODE (dashed border)
        // ============================================================
        const codeBoxHeight = 44;
        doc.roundedRect(MARGIN, y, CONTENT_WIDTH, codeBoxHeight, 4)
            .dash([4, 4]).strokeColor(DARK_BLUE).lineWidth(1.5).stroke().undash();

        doc.font('Helvetica').fontSize(6).fillColor(MEDIUM_GRAY)
            .text('CÓDIGO DE VALIDACIÓN', MARGIN, y + 6, { width: CONTENT_WIDTH, align: 'center', characterSpacing: 1.5 });
        doc.font('Helvetica-Bold').fontSize(16).fillColor(DARK_BLUE)
            .text(this.escapeText(invoice.number), MARGIN, y + 18, { width: CONTENT_WIDTH, align: 'center', characterSpacing: 2 });

        y += codeBoxHeight + 10;

        // ============================================================
        // META INFO: Emisión | Entrega | Estado
        // ============================================================
        const metaGap = 8;
        const metaWidth = (CONTENT_WIDTH - metaGap * 2) / 3;
        const metaX1 = MARGIN;
        const metaX2 = MARGIN + metaWidth + metaGap;
        const metaX3 = MARGIN + 2 * (metaWidth + metaGap);
        const metaY = y;

        const statusInfo = this.getStatusStyle(invoice.status ?? '');
        const metaItems = [
            { label: 'EMISIÓN', value: this.formatDate(invoice.issueDate), x: metaX1 },
            { label: 'ENTREGA', value: invoice.deliveryDate ? this.formatDate(invoice.deliveryDate) : '—', x: metaX2 },
            { label: 'ESTADO', value: statusInfo.label, x: metaX3, isStatus: true, textColor: statusInfo.textColor, bgColor: statusInfo.bgColor },
        ];

        for (const item of metaItems) {
            // Top border
            doc.moveTo(item.x, metaY).lineTo(item.x + metaWidth, metaY).strokeColor(LIGHT_GRAY).lineWidth(1).stroke();

            doc.font('Helvetica').fontSize(6).fillColor(MEDIUM_GRAY)
                .text(item.label, item.x, metaY + 4, { width: metaWidth, align: 'center', characterSpacing: 1 });

            if (item.isStatus) {
                const badgeY = metaY + 16;
                const badgeW = metaWidth * 0.7;
                const badgeX = item.x + (metaWidth - badgeW) / 2;
                doc.roundedRect(badgeX, badgeY, badgeW, 18, 9).fill(item.bgColor);
                doc.font('Helvetica-Bold').fontSize(7).fillColor(item.textColor)
                    .text(item.value, badgeX, badgeY + 4, { width: badgeW, align: 'center' });
            } else {
                doc.font('Helvetica').fontSize(8).fillColor(VERY_DARK)
                    .text(item.value, item.x, metaY + 16, { width: metaWidth, align: 'center' });
            }
        }

        // ============================================================
        // FOOTER (drawn on every page via pageAdded event)
        // ============================================================
        // We'll add the footer after the first page content
        this.addFooter(doc);
    }

    private addFooter(doc: PDFKit.PDFDocument): void {
        const footerHeight = 65;
        const footerY = A6_HEIGHT - footerHeight;

        // Dark background
        doc.rect(0, footerY, A6_WIDTH, footerHeight).fill(DARK_BLUE);

        const recurso6 = this.staticImageBuffers.get('recurso6');
        const recurso8 = this.staticImageBuffers.get('recurso8');

        // Fixed height, preserve aspect ratio for each image
        const imgHeight = 40;
        const gap = 35;

        let totalWidth = 0;
        const dims6 = recurso6 ? this.getImageDimensions(recurso6) : null;
        const dims8 = recurso8 ? this.getImageDimensions(recurso8) : null;
        const w6 = dims6 ? (dims6.width / dims6.height) * imgHeight : 80;
        const w8 = dims8 ? (dims8.width / dims8.height) * imgHeight : 80;

        if (recurso6) totalWidth += w6;
        if (recurso8) totalWidth += w8;
        if (recurso6 && recurso8) totalWidth += gap;

        let startX = (A6_WIDTH - totalWidth) / 2;

        if (recurso6) {
            doc.image(recurso6, startX, footerY + (footerHeight - imgHeight) / 2, { width: w6, height: imgHeight });
            startX += w6 + gap;
        }
        if (recurso8) {
            doc.image(recurso8, startX, footerY + (footerHeight - imgHeight) / 2, { width: w8, height: imgHeight });
        }
    }
}
