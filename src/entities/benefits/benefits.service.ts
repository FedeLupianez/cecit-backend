
import { BenefitsMapper, BenefitsDTO, BenefitsCreateDTO, BenefitsDeleteDTO, type BenefitsReturn } from './benefits.dto';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { BenefitsEntity, BenefitStatus } from './benefits.entity';
import { PartnersEntity } from '../partners/partners.entity';
import { BenefitTypeEntity } from '../benefit-types/benefit-types.entity';
import { Repository } from 'typeorm';
import { DbService } from 'src/common/database/db.service';
import { PartnersService } from '../partners/partners.service';
import { PartnersCategoriesReturn } from '../partners_categories/partners_categories.dto';
import { AccountsService } from '../accounts/accounts.service';
import { AccountsEntity } from '../accounts/accounts.entity';

import { LessThan, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { PaymentBenefitEntity } from '../payment_benefit/payment_benefit.entity';
import { BenefitTypeService } from '../benefit-types/benefit-types.service';
import { PartnersCategoriesService } from '../partners_categories/partners_categories.service';
import { PaymentBenefitService } from '../payment_benefit/payment_benefit.service';

@Injectable()
export class BenefitsService {
    private readonly logger = new Logger(BenefitsService.name);
    constructor(
        @InjectRepository(BenefitsEntity)
        private readonly benefitsRepository: Repository<BenefitsEntity>,

        private readonly accountService: AccountsService,
        private readonly partnersService: PartnersService,
        private readonly benefitTypeService: BenefitTypeService,
        private readonly partnersCategoriesService: PartnersCategoriesService,
        private readonly paymentBenefitService: PaymentBenefitService,
        private readonly dbService: DbService,
    ) { };

    async get_categories(id_partner: string): Promise<PartnersCategoriesReturn | null> {
        if (!id_partner)
            throw new BadRequestException('ID partner is required');
        const partner = await this.partnersService.get_by_id(id_partner);
        if (!partner)
            throw new NotFoundException('Partner not found');
        const categories = await this.partnersCategoriesService.findByPartner(id_partner);
        if (!categories || categories.length === 0)
            return null;

        const categoryNames: string[] = categories.map(pc => pc.category.name);

        return {
            id_partner: id_partner,
            partner: partner.name,
            id_categories: categories.map(pc => pc.id_category.toString()),
            categories: categoryNames,
        };
    }


    async create(benefit: BenefitsCreateDTO) {
        this.logger.log(`Creating benefit: ${benefit.title}`);
        const admin: AccountsEntity | null = await this.accountService.get_by_id(benefit.id_admin);
        if (!admin) {
            throw new NotFoundException('El administrador no existe');
        }

        const partner: PartnersEntity | null = await this.partnersService.get_by_id(benefit.id_partner);

        if (!partner) {
            throw new NotFoundException('El socio no existe');
        }

        const type: BenefitTypeEntity | null = await this.benefitTypeService.get_by_id(benefit.id_type);

        if (!type) {
            throw new NotFoundException('El tipo de beneficio no existe');
        }

        const newId = await this.dbService.getNewId('Benefits', 'id_benefit');
        const newBenefit = this.benefitsRepository.create({ ...benefit, id_benefit: newId, admin: admin, partner: partner, type: type })

        if (!newId) {
            throw new InternalServerErrorException('No se pudo generar el beneficio');
        }
        return await this.benefitsRepository.save(newBenefit);
    }

    async delete(benefit: BenefitsDeleteDTO): Promise<boolean> {
        const result = await this.benefitsRepository.delete({ id_benefit: benefit.id_benefit })
        if (!result) {
            throw new NotFoundException('El beneficio que se quiere borrar no fué encontrado')
        }
        return true;
    }

    async findOne(id_benefit: string): Promise<BenefitsEntity | null> {
        return await this.benefitsRepository.findOneBy({ id_benefit });
    }

    async incrementCoupons(id_benefit: string, maxCoupons: number): Promise<boolean> {
        const result = await this.benefitsRepository.increment(
            { id_benefit, coupons: LessThan(maxCoupons) },
            'coupons',
            1
        );
        return (result.affected ?? 0) > 0;
    }

    async get_carousel(): Promise<BenefitsDTO[]> {
      const today = new Date();

      const benefits = await this.benefitsRepository.find({
          where: {
              status: BenefitStatus.ACTIVE,
              start_date: LessThanOrEqual(today),
              end_date: MoreThanOrEqual(today),
          },
          order: {
              date_entered: 'DESC',
          },
      });

      return benefits.map((benefit) => BenefitsMapper.toDTO(benefit));
  }
    private async mapBenefits(benefits: BenefitsEntity[]): Promise<BenefitsReturn[]> {
        const benefitsMapped: BenefitsReturn[] = await Promise.all(benefits.map(async (b): Promise<BenefitsReturn> => {
            const categories = b.partner.categories.map((c) => c.category.name);
            const paymentMethods: PaymentBenefitEntity[] = await this.paymentBenefitService.findByBenefit(b.id_benefit);
            const paymentMethodsNames: string[] = paymentMethods.map((p) => p.payment_method.name);
            return {
                direction: b.partner.direction,
                id_benefit: b.id_benefit,
                id_admin: b.id_admin,
                id_partner: b.id_partner,
                partner: b.partner.name,
                payment_methods: paymentMethodsNames,
                type: b.type.name,
                start_date: b.start_date,
                end_date: b.end_date,
                image: b.image,
                title: b.title,
                description: b.description,
                coupons: b.coupons,
                max_coupons: b.max_coupons,
                logo: b.partner.logo,
                categories: categories || [],
            }
        }))
        return benefitsMapped;
    }

    async get_all(): Promise<BenefitsReturn[]> {
        const benefits: BenefitsEntity[] = await this.benefitsRepository.find({ relations: ['partner', 'partner.categories', 'partner.categories.category', 'type'] });
        if (!benefits)
            throw new InternalServerErrorException('There is no benefits yet');
        return await this.mapBenefits(benefits);
    }

    async get_popular(): Promise<BenefitsReturn[]> {

        const benefits: BenefitsEntity[] = await this.benefitsRepository.find({
            relations: [
                'partner',
                'partner.categories',
                'partner.categories.category',
                'type'
            ],
            order: {
                coupons: 'DESC'
            },
            take: 20
        });

        if (!benefits)
            throw new InternalServerErrorException('There is no benefits yet');

        return await this.mapBenefits(benefits);
    }

    async get_news() {
        const benefits: BenefitsEntity[] = await this.benefitsRepository.find({
            relations: [
                'partner',
                'partner.categories',
                'partner.categories.category',
                'type'
            ],
            order: {
                date_entered: 'DESC'
            },
            take: 20
        });

        if (!benefits)
            throw new InternalServerErrorException('There is no benefits yet');

        return await this.mapBenefits(benefits);
    }
}
