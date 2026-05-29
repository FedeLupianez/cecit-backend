import { Test, TestingModule } from '@nestjs/testing';
import { PaymentBenefitController } from './payment_benefit.controller';

describe('PaymentBenefitController', () => {
  let controller: PaymentBenefitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentBenefitController],
    }).compile();

    controller = module.get<PaymentBenefitController>(PaymentBenefitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
