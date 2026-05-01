import { Test, TestingModule } from '@nestjs/testing';
import { BenefitTypeService } from './benefit_type.service';

describe('BenefitTypeService', () => {
  let service: BenefitTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BenefitTypeService],
    }).compile();

    service = module.get<BenefitTypeService>(BenefitTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
