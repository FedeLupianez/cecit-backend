import { Test, TestingModule } from '@nestjs/testing';
import { PaymentBenefitService } from './payment_benefit.service';

describe('PaymentBenefitService', () => {
  let service: PaymentBenefitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentBenefitService],
    }).compile();

    service = module.get<PaymentBenefitService>(PaymentBenefitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
