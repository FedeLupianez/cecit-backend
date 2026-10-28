import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
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
      ],
    }).compile();

    service = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
