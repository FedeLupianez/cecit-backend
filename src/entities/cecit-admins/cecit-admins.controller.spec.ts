import { Test, TestingModule } from '@nestjs/testing';
import { CecitAdminsController } from './cecit-admins.controller';

describe('CecitAdminsController', () => {
  let controller: CecitAdminsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CecitAdminsController],
    }).compile();

    controller = module.get<CecitAdminsController>(CecitAdminsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
