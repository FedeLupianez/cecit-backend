import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { BenefitsCreateDTO, BenefitsDeleteDTO, type BenefitsReturn } from './benefits.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BenefitsEntity } from './benefits.entity';
import { PartnersEntity } from '../partners/partners.entity';
import { BenefitTypeEntity } from '../benefit-types/benefit-types.entity';
import { Repository } from 'typeorm';
import { DbService } from 'src/common/database/db.service';
import { PartnersService } from '../partners/partners.service';
import { PartnersCategoriesEntity } from '../partners_categories/partners_categories.entity';
import { PartnersCategoriesReturn } from '../partners_categories/partners_categories.dto';
import { AccountsService } from '../accounts/accounts.service';
import { AccountsEntity } from '../accounts/accounts.entity';
import { PaymentBenefitEntity } from '../payment_benefit/payment_benefit.entity';

@Injectable()
export class BenefitsService {
    private readonly logger = new Logger(BenefitsService.name);
    constructor(
        @InjectRepository(BenefitsEntity)
        private readonly benefitsRepository: Repository<BenefitsEntity>,

        private readonly accountService: AccountsService,

        private readonly partnersService: PartnersService,

        @InjectRepository(BenefitTypeEntity)
        private readonly benefitTypeRepository: Repository<BenefitTypeEntity>,

        @InjectRepository(PartnersCategoriesEntity)
        private readonly partnersCategoriesRepo: Repository<PartnersCategoriesEntity>,

        @InjectRepository(PaymentBenefitEntity)
        private readonly paymentBenefitRepo: Repository<PaymentBenefitEntity>,

        @Inject() private readonly dbService: DbService
    ) { };

    async get_categories(id_partner: string): Promise<PartnersCategoriesReturn | null> {
        if (!id_partner)
            throw new BadRequestException('ID partner is required');
        const partner = await this.partnersService.get_by_id(id_partner);
        if (!partner)
            throw new NotFoundException('Partner not found');
        const categories = await this.partnersCategoriesRepo.find({
            where: { id_partner: id_partner },
            relations: ['category']
        });
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

    async get_all(): Promise<BenefitsReturn[]> {
        const benefits: BenefitsEntity[] = await this.benefitsRepository.find({ relations: ['partner', 'partner.categories', 'partner.categories.category', 'type'] });
        if (!benefits)
            throw new InternalServerErrorException('There is no benefits yet');
        const benefitsMapped: BenefitsReturn[] = await Promise.all(benefits.map(async (b): Promise<BenefitsReturn> => {
            const categories = b.partner.categories.map((c) => c.category.name);
            const paymentMethods: PaymentBenefitEntity[] = await this.paymentBenefitRepo.find({
                relations: ['payment_method'],
                where: {
                    id_benefit: b.id_benefit
                }
            });
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

        const type: BenefitTypeEntity | null = await this.benefitTypeRepository.findOneBy({ id_type: benefit.id_type });

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

        const benefitsMapped: BenefitsReturn[] = await Promise.all(
            benefits.map(async (b): Promise<BenefitsReturn> => {

                const categories = b.partner.categories.map((c) => c.category.name);

                const paymentMethods: PaymentBenefitEntity[] =
                    await this.paymentBenefitRepo.find({
                        relations: ['payment_method'],
                        where: {
                            id_benefit: b.id_benefit
                        }
                    });

                const paymentMethodsNames: string[] =
                    paymentMethods.map((p) => p.payment_method.name);

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
                    categories: categories || []
                };
            }));
        return benefitsMapped;
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

        const benefitsMapped: BenefitsReturn[] = await Promise.all(
            benefits.map(async (b): Promise<BenefitsReturn> => {

                const categories = b.partner.categories.map((c) => c.category.name);

                const paymentMethods: PaymentBenefitEntity[] =
                    await this.paymentBenefitRepo.find({
                        relations: ['payment_method'],
                        where: {
                            id_benefit: b.id_benefit
                        }
                    });

                const paymentMethodsNames: string[] =
                    paymentMethods.map((p) => p.payment_method.name);

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
                    categories: categories || []
                };
            })
        );
        return benefitsMapped;
    }
}
