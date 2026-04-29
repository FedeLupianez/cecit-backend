import { Test, TestingModule } from '@nestjs/testing';
import { PartnersAdminsService } from './partners-admins.service';

describe('PartnersAdminsService', () => {
  let service: PartnersAdminsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnersAdminsService],
    }).compile();

    service = module.get<PartnersAdminsService>(PartnersAdminsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
