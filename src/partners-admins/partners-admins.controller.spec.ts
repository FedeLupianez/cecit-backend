import { Test, TestingModule } from '@nestjs/testing';
import { PartnersAdminsController } from './partners-admins.controller';

describe('PartnersAdminsController', () => {
  let controller: PartnersAdminsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnersAdminsController],
    }).compile();

    controller = module.get<PartnersAdminsController>(PartnersAdminsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
