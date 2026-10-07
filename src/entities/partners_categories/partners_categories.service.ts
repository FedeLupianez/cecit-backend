import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnersEntity } from '../partners/partners.entity';
import { CategoriesEntity } from '../categories/categories.entity';
import { PartnersCategoriesDto } from './partners_categories.dto';
import { AccountsService } from '../accounts/accounts.service';
import { AccountRole } from '../accounts/accounts.dto';
import { PartnersAdminsService } from '../partnersadmins/partnersadmins.service';

@Injectable()
export class PartnersCategoriesService {
  constructor(
    @InjectRepository(PartnersEntity)
    private partnersRepo: Repository<PartnersEntity>,
    @InjectRepository(CategoriesEntity)
    private categoriesRepo: Repository<CategoriesEntity>,
    private readonly accountsService: AccountsService,
    private readonly partnersAdminsService: PartnersAdminsService,
  ) {}

  async create(data: PartnersCategoriesDto, callerId: string) {
    if (!callerId) throw new BadRequestException('Caller id is required');
    const caller = await this.accountsService.get_by_id(callerId);
    if (caller?.role !== AccountRole.CECIT_ADMIN) {
      await this.partnersAdminsService.verify_admin(callerId, data.id_partner);
    }
    const partner = await this.partnersRepo.findOne({
      where: { id_partner: data.id_partner },
      relations: ['categories'],
    });
    if (!partner) throw new BadRequestException('Partner not found');
    const category = await this.categoriesRepo.findOneBy({
      id_category: data.id_category,
    });
    if (!category) throw new BadRequestException('Category not found');
    if (partner.categories.some((c) => c.id_category === category.id_category))
      return partner;
    partner.categories.push(category);
    return await this.partnersRepo.save(partner);
  }

  async findAll() {
    const partners = await this.partnersRepo.find({
      relations: ['categories'],
    });
    // Return flattened for backward compat
    return partners.flatMap((p) =>
      p.categories.map((c) => ({
        id_partner: p.id_partner,
        id_category: c.id_category,
        partner: p,
        category: c,
      })),
    );
  }

  async findByPartner(id_partner: string): Promise<any[]> {
    const partner = await this.partnersRepo.findOne({
      where: { id_partner },
      relations: ['categories'],
    });
    if (!partner) return [];
    return partner.categories.map((c) => ({
      id_partner,
      id_category: c.id_category,
      category: c,
      partner,
    }));
  }
}
