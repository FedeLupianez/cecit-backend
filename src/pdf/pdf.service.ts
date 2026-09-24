import {
    BadRequestException,
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VouchersEntity } from '../entities/vouchers/vouchers.entity';
import * as pup from 'puppeteer';
import type { Browser } from 'puppeteer';

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

const STATUS_STYLES: Record<string, string> = {
    PENDING: 'color:#b45309;background-color:#fef3c7;',
    DELIVERED: 'color:#15803d;background-color:#dcfce7;',
    EXPIRED: 'color:#b91c1c;background-color:#fee2e2;',
};

/*
 * Imágenes fijas del layout (header/footer). Antes se descargaban
 * en cada request; ahora se cachean en memoria con TTL largo.
 * La base URL se toma de FRONT_URL del .env para compatibilidad
 * dev (localhost:5173) y prod (dominio real).
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
/* Descarta imágenes absurdas antes de inflar el HTML a base64. */
const MAX_IMAGE_BYTES = 2_500_000;

interface CachedImage {
    data: string;
    expiresAt: number;
}

@Injectable()
export class PdfService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PdfService.name);

    /*
     * Singleton del browser: lanzarlo por PDF (~0.5-2s + 100-200MB)
     * era el cuello de botella principal. Se lanza una vez y se
     * reutiliza vía páginas efímeras (page.close por request).
     */
    private browser: Browser | null = null;
    private browserLaunching: Promise<Browser> | null = null;

    /* Caché en memoria LRU simple + deduplicación de fetches. */
    private readonly imageCache = new Map<string, CachedImage>();
    private readonly inflightFetches = new Map<string, Promise<string>>();

    constructor(
        @InjectRepository(VouchersEntity)
        private readonly vouchersRepository: Repository<VouchersEntity>,
        private readonly configService: ConfigService,
    ) { }

    onModuleInit() {
        /* Warmup en background: no bloquea el arranque ni los tests. */
        void this.warmup().catch((e) =>
            this.logger.warn(`PDF warmup failed: ${e?.message ?? e}`),
        );
    }

    async onModuleDestroy() {
        this.imageCache.clear();
        this.inflightFetches.clear();
        if (this.browser) {
            try {
                await this.browser.close();
            } catch {
                /* Ya cerrado / proceso muerto: nada que hacer. */
            } finally {
                this.browser = null;
            }
        }
    }

    private async warmup(): Promise<void> {
        await this.getBrowser();
        await this.getStaticImages();
    }

    private async getBrowser(): Promise<Browser> {
        if (this.browser?.connected) return this.browser;
        /* Cierro referencia stale si el proceso murió. */
        if (this.browser && !this.browser.connected) {
            this.browser = null;
        }
        if (this.browserLaunching) return this.browserLaunching;

        this.browserLaunching = pup
            .launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--no-first-run',
                    '--no-zygote',
                ],
            })
            .then((browser) => {
                browser.on('disconnected', () => {
                    if (this.browser === browser) this.browser = null;
                });
                this.browser = browser;
                return browser;
            })
            .finally(() => {
                this.browserLaunching = null;
            });

        return this.browserLaunching;
    }

    private escapeHtml(value: string): string {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    private formatDate(date?: Date | string | null): string {
        if (!date) return '—';

        /*
         * Las columnas `date` de la DB llegan como string 'YYYY-MM-DD'
         * (o Date a medianoche UTC). Parsearlas con `new Date()` y usar
         * getDate()/getMonth() corre todo a hora local (UTC-3) y muestra
         * el día anterior. Por eso se extrae el calendario sin convertir
         * zona horaria.
         */
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

    private async tryImage(url?: string): Promise<string | null> {
        if (!url) return null;

        try {
            return await this.urlToBase64(url, DYNAMIC_IMAGE_TTL_MS);
        } catch (e) {
            this.logger.warn(
                `Could not load image ${url}: ${e?.message ?? e}`,
            );

            return null;
        }
    }

    private getFromCache(url: string): string | null {
        const cached = this.imageCache.get(url);
        if (!cached) return null;
        if (cached.expiresAt < Date.now()) {
            this.imageCache.delete(url);
            return null;
        }
        /* Refresh LRU: los más usados quedan al final. */
        this.imageCache.delete(url);
        this.imageCache.set(url, cached);
        return cached.data;
    }

    private setCache(url: string, data: string, ttlMs: number): void {
        if (this.imageCache.has(url)) this.imageCache.delete(url);
        while (this.imageCache.size >= MAX_CACHED_IMAGES) {
            const oldest = this.imageCache.keys().next();
            if (oldest.done) break;
            this.imageCache.delete(oldest.value);
        }
        this.imageCache.set(url, {
            data,
            expiresAt: Date.now() + ttlMs,
        });
    }

    private getStaticImagesUrls(): { cecitLogo: string; recurso6: string; recurso8: string } {
        const frontUrl = this.configService.get<string>('FRONT_URL', 'https://centrodecomercioag.com.ar');
        return {
            cecitLogo: `${frontUrl}${STATIC_IMAGE_PATHS.cecitLogo}`,
            recurso6: `${frontUrl}${STATIC_IMAGE_PATHS.recurso6}`,
            recurso8: `${frontUrl}${STATIC_IMAGE_PATHS.recurso8}`,
        };
    }

    private async getStaticImages(): Promise<{
        cecitLogo: string;
        recurso6: string;
        recurso8: string;
    }> {
        const urls = this.getStaticImagesUrls();
        const [cecitLogo, recurso6, recurso8] = await Promise.all([
            this.urlToBase64(urls.cecitLogo, STATIC_IMAGE_TTL_MS),
            this.urlToBase64(urls.recurso6, STATIC_IMAGE_TTL_MS),
            this.urlToBase64(urls.recurso8, STATIC_IMAGE_TTL_MS),
        ]);
        return { cecitLogo, recurso6, recurso8 };
    }

    private buildInvoiceHtml(
        invoice: InvoiceData,
        providerLogo: string | null,
        itemImage: string | null,
    ): string {
        const esc = (v?: string | null) =>
            this.escapeHtml(String(v ?? '')) || '—';

        const statusKey = String(invoice.status ?? '').toUpperCase();

        const statusLabel =
            STATUS_LABELS[statusKey] ?? esc(invoice.status);

        const statusStyle =
            STATUS_STYLES[statusKey] ??
            'color:#374151;background-color:#f3f4f6;';

        const thumb = itemImage
            ? `
                <img
                    style="
                        width:52px;
                        height:52px;
                        object-fit:cover;
                        border-radius:4px;
                        border:1px solid #e5e7eb;
                        display:block;
                    "
                    src="${itemImage}"
                    alt=""
                />
            `
            : `
                <div
                    style="
                        width:52px;
                        height:52px;
                        border-radius:4px;
                        border:1px solid #e5e7eb;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        color:#9ca3af;
                        font-size:14px;
                        font-weight:bold;
                    "
                >
                    ${esc(
                invoice.item.title.charAt(0).toUpperCase(),
            )}
                </div>
            `;

        const logo = providerLogo
            ? `
                <img
                    style="
                        max-width:70px;
                        max-height:26px;
                        object-fit:contain;
                        margin-bottom:4px;
                    "
                    src="${providerLogo}"
                    alt=""
                />
            `
            : '';

        return `
            <div class="invoice">

                <div class="inv-head">
                    <div>
                        <h1>Comprobante</h1>
                        <p class="sub">
                            Canje de beneficio · CeCIT
                        </p>
                    </div>

                    <div class="inv-num">
                        <span>Nº</span>
                        <strong>${esc(invoice.number)}</strong>
                    </div>
                </div>

                <div class="grid">

                    <div class="card">
                        <h2>Socio</h2>

                        <p>
                            <span>Nombre:</span>
                            ${esc(
            `${invoice.customer.name} ${invoice.customer.lastname}`,
        )}
                        </p>

                        <p>
                            <span>DNI:</span>
                            ${esc(invoice.customer.dni)}
                        </p>

                        <p>
                            <span>Legajo:</span>
                            ${esc(invoice.customer.id)}
                        </p>
                    </div>

                    <div class="card">
                        <h2>Comercio</h2>

                        ${logo}

                        <p>
                            <span>Razón social:</span>
                            ${esc(invoice.provider.name)}
                        </p>

                        <p>
                            <span>Dirección:</span>
                            ${esc(invoice.provider.address)}
                        </p>
                    </div>

                </div>

                <table class="detail">
                    <thead>
                        <tr>
                            <th colspan="2">
                                Detalle del beneficio
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td class="thumb">
                                ${thumb}
                            </td>

                            <td>
                                <strong class="item-title">
                                    ${esc(invoice.item.title)}
                                </strong>

                                <p class="desc">
                                    ${esc(invoice.item.description)}
                                </p>

                                <p class="validity">
                                    <span>Vigencia:</span>
                                    ${this.formatDate(
            invoice.item.startDate,
        )}
                                    al
                                    ${this.formatDate(
            invoice.item.endDate,
        )}
                                </p>
                            </td>
                        </tr>

                        <tr class="totals">
                            <td>Cantidad</td>

                            <td style="text-align:right;">
                                1
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="code">
                    <span>
                        Código de validación
                    </span>

                    <strong>
                        ${esc(invoice.number)}
                    </strong>
                </div>

                <div class="meta">

                    <div>
                        <dt>Emisión</dt>
                        <dd>
                            ${this.formatDate(invoice.issueDate)}
                        </dd>
                    </div>

                    <div>
                        <dt>Entrega</dt>
                        <dd>
                            ${invoice.deliveryDate
                ? this.formatDate(
                    invoice.deliveryDate,
                )
                : '—'
            }
                        </dd>
                    </div>

                    <div>
                        <dt>Estado</dt>
                        <dd>
                            <em
                                class="status"
                                style="${statusStyle}"
                            >
                                ${statusLabel}
                            </em>
                        </dd>
                    </div>

                </div>

            </div>

            <style>
                .invoice {
                    width: 100%;
                    padding-top: 0;
                }

                .inv-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 8px;
                    border-bottom: 3px solid #151532;
                    padding-bottom: 8px;
                    margin-bottom: 10px;
                }

                .inv-head h1 {
                    font-size: 17px;
                    letter-spacing: 1px;
                    color: #151532;
                    text-transform: uppercase;
                    line-height: 1.1;
                }

                .inv-head .sub {
                    font-size: 8px;
                    color: #6b7280;
                    margin-top: 2px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .inv-num {
                    text-align: center;
                    background-color: #151532;
                    color: #ffffff;
                    padding: 5px 10px;
                    border-radius: 4px;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                .inv-num span {
                    display: block;
                    font-size: 7px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    opacity: 0.8;
                }

                .inv-num strong {
                    font-size: 13px;
                    letter-spacing: 2px;
                    font-family: 'Courier New', monospace;
                }

                .grid {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 10px;
                }

                .card {
                    flex: 1;
                    border: 1px solid #e5e7eb;
                    border-radius: 4px;
                    padding: 6px 8px;
                    min-width: 0;
                }

                .card h2 {
                    font-size: 8px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #151532;
                    border-bottom: 1px solid #e5e7eb;
                    padding-bottom: 3px;
                    margin-bottom: 4px;
                }

                .card p {
                    font-size: 8.5px;
                    margin-bottom: 2px;
                    word-break: break-word;
                }

                .card p span {
                    color: #6b7280;
                }

                table.detail {
                    width: 100%;
                    border-collapse: collapse;
                    border: 1px solid #e5e7eb;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 10px;
                }

                table.detail thead th {
                    background-color: #151532;
                    color: #ffffff;
                    text-align: left;
                    font-size: 8px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    padding: 4px 8px;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                table.detail td {
                    padding: 6px 8px;
                    vertical-align: top;
                    font-size: 8.5px;
                }

                table.detail td.thumb {
                    width: 56px;
                }

                .item-title {
                    font-size: 9.5px;
                    color: #151532;
                }

                .desc {
                    margin: 2px 0;
                    color: #374151;
                }

                .validity span {
                    color: #6b7280;
                }

                table.detail tr.totals td {
                    border-top: 1px solid #e5e7eb;
                    background-color: #f9fafb;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-size: 8px;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                .code {
                    border: 1.5px dashed #151532;
                    border-radius: 4px;
                    padding: 6px;
                    text-align: center;
                    margin-bottom: 10px;
                }

                .code span {
                    display: block;
                    font-size: 7px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: #6b7280;
                    margin-bottom: 2px;
                }

                .code strong {
                    font-size: 20px;
                    letter-spacing: 6px;
                    font-family: 'Courier New', monospace;
                    color: #151532;
                }

                .meta {
                    display: flex;
                    gap: 8px;
                }

                .meta > div {
                    flex: 1;
                    text-align: center;
                    border-top: 1px solid #e5e7eb;
                    padding-top: 4px;
                }

                .meta dt {
                    font-size: 7px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #6b7280;
                }

                .meta dd {
                    font-size: 8.5px;
                    color: #111827;
                    margin-top: 1px;
                }

                em.status {
                    font-style: normal;
                    display: inline-block;
                    padding: 1px 6px;
                    border-radius: 999px;
                    font-size: 8px;
                    font-weight: bold;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            </style>
        `;
    }

    async generateVoucherPDF(token: string): Promise<Buffer> {
        this.logger.debug(`Generating PDF for voucher: ${token}`);

        if (!token) throw new BadRequestException('Token does not exists');

        /*
         * Buscamos el voucher por el token recibido
         * como query param, junto con sus relaciones,
         * para obtener los datos vigentes al momento
         * de generar el PDF.
         */
        const voucher = await this.vouchersRepository.findOne({
            where: { token },
            relations: { account: { user: true } as any, benefit: { partner: { directions: true } } },
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

    async generateInvoicePDF(
        invoice: InvoiceData,
    ): Promise<Buffer> {
        this.logger.debug(
            `Generating invoice PDF ${invoice.number}`,
        );

        const [providerLogo, itemImage] = await Promise.all([
            this.tryImage(invoice.provider.logo),
            this.tryImage(invoice.item.image),
        ]);

        return await this.generatePDF(
            this.buildInvoiceHtml(
                invoice,
                providerLogo,
                itemImage,
            ),
        );
    }

    private async urlToBase64(
        url: string,
        ttlMs: number = DYNAMIC_IMAGE_TTL_MS,
    ): Promise<string> {
        const normalized = url?.trim();
        if (!normalized) throw new Error('Empty image URL');

        const cached = this.getFromCache(normalized);
        if (cached) return cached;

        /* Deduplica fetches concurrentes a la misma URL. */
        const inflight = this.inflightFetches.get(normalized);
        if (inflight) return inflight;

        const task = this.fetchImageAsBase64(normalized).then((data) => {
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

    private async fetchImageAsBase64(url: string): Promise<string> {
        const res = await fetch(url, {
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status} fetching ${url}`);
        }

        const mime = (res.headers.get('content-type') ?? '')
            .split(';')[0]
            .trim()
            .toLowerCase();
        if (!mime.startsWith('image/')) {
            throw new Error(`Unexpected content-type "${mime}" for ${url}`);
        }

        /* Evita descargar archivos gigantes antes de tiempo. */
        const declared = Number(res.headers.get('content-length'));
        if (Number.isFinite(declared) && declared > MAX_IMAGE_BYTES) {
            throw new Error(
                `Image too large (${declared} bytes): ${url}`,
            );
        }

        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length === 0) throw new Error(`Empty image: ${url}`);
        if (buf.length > MAX_IMAGE_BYTES) {
            throw new Error(
                `Image too large (${buf.length} bytes): ${url}`,
            );
        }

        return `data:${mime};base64,${buf.toString('base64')}`;
    }

    async generatePDF(html: string): Promise<Buffer> {
        this.logger.debug('Generating PDF');

        const browser = await this.getBrowser();
        const page = await browser.newPage();

        try {
            /*
             * Imágenes fijas cacheadas: el primer request las descarga,
             * el resto reutiliza el base64 en memoria.
             */
            const staticUrls = this.getStaticImagesUrls();
            const [cecitLogo, recurso6, recurso8] =
                await Promise.all([
                    this.urlToBase64(
                        staticUrls.cecitLogo,
                        STATIC_IMAGE_TTL_MS,
                    ),
                    this.urlToBase64(
                        staticUrls.recurso6,
                        STATIC_IMAGE_TTL_MS,
                    ),
                    this.urlToBase64(
                        staticUrls.recurso8,
                        STATIC_IMAGE_TTL_MS,
                    ),
                ]);

            /*
             * IMPORTANTE:
             *
             * El header de CeCIT está dentro del body.
             * NO usamos headerTemplate para él.
             *
             * De esta manera solo aparece una vez,
             * al principio del documento, y no se repite
             * automáticamente en la segunda página.
             */
            const fullHtml = `
                <!DOCTYPE html>

                <html>
                    <head>
                        <style>
                            * {
                                margin: 0;
                                padding: 0;
                                box-sizing: border-box;
                            }

                            html,
                            body {
                                width: 100%;
                                background-color: #ffffff;
                            }

                            body {
                                font-family:
                                    'Segoe UI',
                                    Arial,
                                    Helvetica,
                                    sans-serif;

                                color: #111827;
                                font-size: 10px;
                                line-height: 1.45;

                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }

                            img {
                                max-width: 100%;
                            }

                            /*
                             * HEADER PRINCIPAL
                             *
                             * Está dentro del contenido y por eso
                             * solo se renderiza una vez.
                             */
                            .pdf-header {
                                width: 100%;
                                height: 60px;

                                background-color: #151532;

                                display: flex;
                                align-items: center;
                                justify-content: center;

                                margin: 0 0 10px 0;

                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }

                            .pdf-header img {
                                height: 46px;
                                width: auto;
                                max-width: 90%;
                                object-fit: contain;
                                display: block;
                            }

                            /*
                             * Evita que los bloques principales se
                             * corten innecesariamente entre páginas.
                             */
                            .inv-head,
                            .grid,
                            table.detail,
                            .code,
                            .meta {
                                break-inside: avoid;
                                page-break-inside: avoid;
                            }
                        </style>
                    </head>

                    <body>

                        <!--
                            HEADER SOLO UNA VEZ.
                            No es headerTemplate de Puppeteer.
                        -->
                        <div class="pdf-header">
                            <img
                                src="${cecitLogo}"
                                alt="CeCIT"
                            />
                        </div>

                        ${html}

                    </body>
                </html>
            `;

            await page.setContent(fullHtml, {
                waitUntil: 'domcontentloaded',
            });

            /*
             * Esperamos a que las imágenes y fuentes estén
             * completamente disponibles antes de generar el PDF.
             */
            await page.evaluate(async () => {
                if (document.fonts?.ready) {
                    await document.fonts.ready;
                }

                const images = Array.from(
                    document.images,
                );

                await Promise.all(
                    images.map((img) => {
                        if (img.complete) {
                            return Promise.resolve();
                        }

                        return new Promise<void>((resolve) => {
                            img.addEventListener(
                                'load',
                                () => resolve(),
                                { once: true },
                            );

                            img.addEventListener(
                                'error',
                                () => resolve(),
                                { once: true },
                            );
                        });
                    }),
                );
            });

            const pdf = await page.pdf({
                format: 'A6',

                printBackground: true,

                /*
                 * No usamos headerTemplate.
                 *
                 * El margen superior queda en 0 porque el header
                 * ya forma parte del contenido.
                 */
                displayHeaderFooter: true,

                margin: {
                    top: '0px',
                    bottom: '70px',
                    left: '0px',
                    right: '0px',
                },

                /*
                 * El footer sí continúa siendo gestionado por
                 * Puppeteer y aparecerá en las páginas generadas.
                 */
                footerTemplate: `
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                        }
                    </style>

                    <div
                        style="
                            margin:0;
                            padding:0;
                            width:100%;
                            height:100%;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            gap:35px;
                            background-color:#151532;
                            -webkit-print-color-adjust:exact;
                            print-color-adjust:exact;
                        "
                    >
                        <img
                            style="
                                height:52px;
                                max-width:100px;
                                object-fit:contain;
                                display:block;
                            "
                            src="${recurso6}"
                            alt="Paseo Libertador y Paseo del Centro"
                        />

                        <img
                            style="
                                height:52px;
                                max-width:100px;
                                object-fit:contain;
                                display:block;
                            "
                            src="${recurso8}"
                            alt="Nos respaldan: CAME y FEDECOM"
                        />
                    </div>
                `,
            });

            return Buffer.from(pdf);
        } finally {
            /* Solo se cierra la página: el browser singleton se reutiliza. */
            await page.close().catch(() => undefined);
        }
    }
}
