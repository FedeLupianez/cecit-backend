import {
    BenefitsMapper,
    BenefitsDTO,
    BenefitsCreateDTO,
    BenefitIDTO,
    BenefitsUpdateDTO,
    type BenefitsReturn,
    CouponsReturn,
} from './benefits.dto';
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { BenefitsEntity, BenefitStatus } from './benefits.entity';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { PartnersService } from '../partners/partners.service';
import { PartnersCategoriesReturn } from '../partners_categories/partners_categories.dto';
import { AccountsService } from '../accounts/accounts.service';
import { generateUniqueId } from 'src/common/utils/id-generator';

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
    ) { }
    private readonly defaultRelations = [
        'partner',
        'partner.directions',
        'partner.categories',
        'partner.categories.category',
        'type',
    ];

    private async findActives(options?: FindManyOptions<BenefitsEntity>) {
        const benefits = await this.benefitsRepository.find({
            relations: this.defaultRelations,
            ...options,
            where: {
                ...(options?.where as object),
                status: BenefitStatus.ACTIVE,
                partner: { categories: { category: { active: true } } },
            },
        });
        return benefits;
    }

    async findOneActive(options?: FindOneOptions<BenefitsEntity>): Promise<BenefitsEntity> {
        const benefit = await this.benefitsRepository.findOne({
            relations: this.defaultRelations,
            ...options,
            where: {
                ...(options?.where as object),
                status: BenefitStatus.ACTIVE,
                partner: { categories: { category: { active: true } } },
            },
        });
        if (!benefit)
            throw new NotFoundException('Benefit not found');
        return benefit;
    }

    async get_categories(id_partner: string): Promise<PartnersCategoriesReturn | null> {
        if (!id_partner) throw new BadRequestException('ID partner is required');
        const partner = await this.partnersService.get_by_id(id_partner);
        if (!partner) throw new NotFoundException('Partner not found');
        const categories =
            await this.partnersCategoriesService.findByPartner(id_partner);
        if (!categories || categories.length === 0) return null;

        const categoryNames: string[] = categories.map((pc) => pc.category.name);

        return {
            id_partner: id_partner,
            partner: partner.name,
            id_categories: categories.map((pc) => pc.id_category.toString()),
            categories: categoryNames,
        };
    }

    async create(benefit: BenefitsCreateDTO) {
        this.logger.log(`Creating benefit: ${benefit.title}`);
        const [admin, partner, type] = await Promise.all([
            this.accountService.get_by_id(benefit.id_admin),
            this.partnersService.get_by_id(benefit.id_partner),
            this.benefitTypeService.get_by_id(benefit.id_type),
        ]);
        if (!admin) {
            throw new NotFoundException('El administrador no existe');
        }

        if (!partner) {
            throw new NotFoundException('El socio no existe');
        }

        if (!type) {
            throw new NotFoundException('El tipo de beneficio no existe');
        }

        const newId = await generateUniqueId(this.benefitsRepository, 'id_benefit');
        const newBenefit = this.benefitsRepository.create({
            ...benefit,
            id_benefit: newId,
            admin: admin,
            partner: partner,
            type: type,
        });


        if (!newId) {
            throw new InternalServerErrorException('No se pudo generar el beneficio');
        }
        const storedBenefit = await this.benefitsRepository.save(newBenefit);
        if (!storedBenefit)
            throw new InternalServerErrorException('Error creating Benefit');

        await Promise.all(
            (benefit.payment_methods ?? []).map((p) =>
                this.paymentBenefitService.make_relation(newBenefit.id_benefit, p),
            ),
        );
        return storedBenefit;
    }

    async delete(benefit: BenefitIDTO): Promise<boolean> {
        const result = await this.benefitsRepository.update(benefit.id_benefit, { status: BenefitStatus.INACTIVE });
        if (!result) {
            throw new NotFoundException(
                'El beneficio que se quiere borrar no fué encontrado',
            );
        }
        return true;
    }

    async update(dto: BenefitsUpdateDTO): Promise<BenefitsReturn> {
        const benefit = await this.findOneActive({
            where: { id_benefit: dto.id_benefit },
        });
        if (!benefit) throw new NotFoundException('Benefit not found');

        if (dto.title !== undefined) benefit.title = dto.title;
        if (dto.description !== undefined) benefit.description = dto.description;
        if (dto.image !== undefined) benefit.image = dto.image;
        if (dto.start_date !== undefined) benefit.start_date = dto.start_date;
        if (dto.end_date !== undefined) benefit.end_date = dto.end_date;
        if (dto.coupons !== undefined) benefit.coupons = dto.coupons;
        if (dto.max_coupons !== undefined)
            benefit.max_coupons = dto.max_coupons;
        if (dto.max_per_user !== undefined)
            benefit.max_per_user = dto.max_per_user;
        if (dto.status !== undefined)
            benefit.status = dto.status as BenefitStatus;

        await this.benefitsRepository.save(benefit);
        return await this.get_benefit(benefit.id_benefit);
    }


    async incrementCoupons(id_benefit: string, maxCoupons: number): Promise<boolean> {
        const result = await this.benefitsRepository.increment(
            { id_benefit, coupons: LessThan(maxCoupons) },
            'coupons',
            1,
        );
        return (result.affected ?? 0) > 0;
    }

    async get_carousel(): Promise<BenefitsDTO[]> {
        const today = new Date();

        const benefits = await this.findActives({
            where: {
                start_date: LessThanOrEqual(today),
                end_date: MoreThanOrEqual(today),
            },
            order: {
                date_entered: 'DESC',
            },
        });
        if (!benefits)
            throw new NotFoundException('Benefits not found');

        return benefits.map((benefit) => BenefitsMapper.toDTO(benefit));
    }

    private async mapBenefit(benefit: BenefitsEntity): Promise<BenefitsReturn> {
        if (!benefit)
            throw new BadRequestException('Invalid benefit')
        const paymentMethods: PaymentBenefitEntity[] = await this.paymentBenefitService.findByBenefit(benefit.id_benefit);
        const paymentMethodsNames: string[] = paymentMethods.map((p) => p.payment_method.name);
        const categories = benefit.partner.categories.map(c => c.category.name);
        const benefitMapped: BenefitsReturn = {
            directions: (benefit.partner.directions ?? []).map((d) => d.direction),
            id_benefit: benefit.id_benefit,
            id_admin: benefit.id_admin,
            id_partner: benefit.id_partner,
            partner: benefit.partner.name,
            payment_methods: paymentMethodsNames,
            type: benefit.type.name,
            start_date: benefit.start_date,
            end_date: benefit.end_date,
            image: benefit.image,
            title: benefit.title,
            description: benefit.description,
            coupons: benefit.coupons,
            max_coupons: benefit.max_coupons,
            logo: benefit.partner.logo,
            categories: categories || [],
            max_per_user: benefit.max_per_user,
            status: benefit.status,
        };
        return benefitMapped;
    }

    private async mapBenefits(benefits: BenefitsEntity[]): Promise<BenefitsReturn[]> {
        const ids = benefits.map((b) => b.id_benefit);
        const allPaymentBenefits =
            await this.paymentBenefitService.findByBenefits(ids);
        const paymentByBenefit = new Map<string, PaymentBenefitEntity[]>();
        for (const pb of allPaymentBenefits) {
            const list = paymentByBenefit.get(pb.id_benefit) || [];
            list.push(pb);
            paymentByBenefit.set(pb.id_benefit, list);
        }

        const benefitsMapped: BenefitsReturn[] = benefits.map(
            (b): BenefitsReturn => {
                const categories = b.partner.categories.map((c) => c.category.name);
                const paymentMethods = paymentByBenefit.get(b.id_benefit) || [];
                const paymentMethodsNames: string[] = paymentMethods.map(
                    (p) => p.payment_method.name,
                );
                return {
                    directions: (b.partner.directions ?? []).map((d) => d.direction),
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
                    max_per_user: b.max_per_user,
                    status: b.status
                };
            },
        );
        return benefitsMapped;
    }

    async get_all(): Promise<BenefitsReturn[]> {
        const benefits: BenefitsEntity[] = await this.benefitsRepository.find({
            relations: [
                'partner',
                'partner.directions',
                'partner.categories',
                'partner.categories.category',
                'type',
            ],
        });
        if (!benefits)
            throw new InternalServerErrorException('There is no benefits yet');
        return await this.mapBenefits(benefits);
    }

    async get_actives(): Promise<BenefitsReturn[]> {
        const benefits: BenefitsEntity[] = await this.findActives();
        if (!benefits)
            throw new InternalServerErrorException('There is no benefits yet');

        return await this.mapBenefits(benefits);
    }

    async get_popular(): Promise<BenefitsReturn[]> {
        const benefits: BenefitsEntity[] = await this.findActives({
            order: {
                coupons: 'DESC',
            },
            take: 20,
        });

        if (!benefits)
            throw new InternalServerErrorException('There is no benefits yet');

        return await this.mapBenefits(benefits);
    }

    async search(q: string): Promise<BenefitsReturn[]> {
        this.logger.debug(q);
        if (!q) throw new BadRequestException('Search text is required');
        const benefits: BenefitsEntity[] = await this.benefitsRepository
            .createQueryBuilder('benefit')
            .leftJoinAndSelect('benefit.partner', 'partner')
            .leftJoinAndSelect('benefit.type', 'type')
            .leftJoinAndSelect('partner.directions', 'directions')
            .leftJoinAndSelect('partner.categories', 'categories')
            .leftJoinAndSelect('categories.category', 'category')
            .where(
                '(LOWER(benefit.title) LIKE LOWER(:q) OR LOWER(benefit.description) LIKE LOWER(:q)) AND benefit.status = :status AND category.active = :catActive',
                { q: `%${q}%`, status: BenefitStatus.ACTIVE, catActive: true },
            )
            .getMany();

        return this.mapBenefits(benefits);
    }

    async get_news() {
        const benefits: BenefitsEntity[] = await this.findActives({
            order: {
                date_entered: 'DESC',
            },
            take: 20,
        });

        if (!benefits)
            throw new InternalServerErrorException('There is no benefits yet');

        return await this.mapBenefits(benefits);
    }

    async getPaymentMethodNames(id_benefit: string): Promise<string[]> {
        const relations =
            await this.paymentBenefitService.findByBenefit(id_benefit);
        return relations.map((p) => p.payment_method.name);
    }

    async getMappedByIds(ids: string[]): Promise<Map<string, BenefitsReturn>> {
        const unique = [...new Set(ids)];
        if (unique.length === 0) return new Map();
        const benefits: BenefitsEntity[] = await this.benefitsRepository.find({
            relations: this.defaultRelations,
            where: {
                id_benefit: In(unique),
                status: BenefitStatus.ACTIVE,
                partner: { categories: { category: { active: true } } },
            },
        });
        const mapped = await this.mapBenefits(benefits);
        return new Map(mapped.map((m) => [m.id_benefit, m]));
    }

    async get_benefit(id_benefit: string): Promise<BenefitsReturn> {
        const benefit = await this.findOneActive({
            where: { id_benefit: id_benefit },
        });
        if (!benefit)
            throw new NotFoundException('Benefit not found');
        return await this.mapBenefit(benefit);
    }

    async get_coupons(id_benefit: string): Promise<CouponsReturn> {
        const benefit = await this.findOneActive({ where: { id_benefit: id_benefit } });
        if (!benefit)
            throw new NotFoundException('Benefit not found');
        return { coupons: benefit.coupons, max_coupons: benefit.max_coupons, max_per_user: benefit.max_per_user };
    }

    async get_by_partner(id_partner: string): Promise<BenefitsReturn[]> {
        const benefits: BenefitsEntity[] = await this.findActives({
            where: { id_partner: id_partner },
        });
        if (!benefits)
            throw new InternalServerErrorException('There is no benefits yet');

        return await this.mapBenefits(benefits);
    }
}
