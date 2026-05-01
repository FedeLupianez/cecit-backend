import { Test, TestingModule } from '@nestjs/testing';
import { BenefitTypeController } from './benefit_type.controller';

describe('BenefitTypeController', () => {
  let controller: BenefitTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BenefitTypeController],
    }).compile();

    controller = module.get<BenefitTypeController>(BenefitTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
