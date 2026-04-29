import { Test, TestingModule } from '@nestjs/testing';
import { CecitAdminsService } from './cecit-admins.service';

describe('CecitAdminsService', () => {
  let service: CecitAdminsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CecitAdminsService],
    }).compile();

    service = module.get<CecitAdminsService>(CecitAdminsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
