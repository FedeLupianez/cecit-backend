import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { PdfService } from './pdf.service';
import { VouchersEntity } from '../entities/vouchers/vouchers.entity';

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PdfService,
        {
          provide: getRepositoryToken(VouchersEntity),
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string, defaultValue?: string) => defaultValue,
          },
        },
        {
          provide: PinoLogger,
          useValue: { setContext: jest.fn(), debug: jest.fn(), warn: jest.fn(), info: jest.fn(), error: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
