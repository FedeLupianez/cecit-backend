import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BenefitsDTO, BenefitsCreateDTO, BenefitsDeleteDTO, BenefitsMapper, type BenefitsReturn } from './benefits.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BenefitsEntity } from './benefits.entity';
import { CecitAdminsEntity } from '../cecit-admins/cecit-admins.entity';
import { PartnersEntity } from '../partners/partners.entity';
import { BenefitTypeEntity } from '../benefit_type/benefit_type.entity';
import { Repository } from 'typeorm';
import { DbService } from 'src/common/database/db.service';
import { CategoriesService } from '../categories/categories.service';
import { PartnersService } from '../partners/partners.service';
import { PartnersCategoriesEntity } from '../partners_categories/partners_categories.entity';
import { PartnersCategoriesReturn } from '../partners_categories/partners_categories.dto';

@Injectable()
export class BenefitsService {
    constructor(
        @InjectRepository(BenefitsEntity)
        private readonly benefitsRepository: Repository<BenefitsEntity>,

        @InjectRepository(CecitAdminsEntity)
        private readonly adminRepository: Repository<CecitAdminsEntity>,

        private readonly partnersService: PartnersService,

        @InjectRepository(BenefitTypeEntity)
        private readonly benefitTypeRepository: Repository<BenefitTypeEntity>,

        @InjectRepository(PartnersCategoriesEntity)
        private readonly partnersCategoriesRepo: Repository<PartnersCategoriesEntity>,

        @Inject() private readonly db_service: DbService
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
        const benefits = await this.benefitsRepository.find();
        if (!benefits)
            throw new InternalServerErrorException('There is no benefits yet');
        const benefitsMapped: BenefitsReturn[] = await Promise.all(benefits.map(async (b): Promise<BenefitsReturn> => {
            const benefitType = await this.benefitTypeRepository.findOneBy({ id_type: b.id_type });
            const categories = await this.get_categories(b.id_partner);
            if (!benefitType)
                throw new InternalServerErrorException('Category not found');
            return {
                id_admin: b.id_admin,
                id_partner: b.id_partner,
                type: benefitType.name,
                start_date: b.start_date,
                end_date: b.end_date,
                image: b.image,
                title: b.title,
                description: b.description,
                coupons: b.coupons,
                max_coupons: b.max_coupons,
                categories: categories?.categories || []
            }
        }))
        return benefitsMapped;
    }

    async create(benefit: BenefitsCreateDTO) {
        const admin: CecitAdminsEntity | null = await this.adminRepository.findOneBy({ id_c_admin: benefit.id_admin });

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

        const new_id = await this.db_service.get_new_id('Benefits', 'id_benefit');
        const new_benefit = this.benefitsRepository.create({ ...benefit, id_benefit: new_id, admin: admin, partner: partner, type: type })

        if (!new_id) {
            throw new InternalServerErrorException('No se pudo generar el beneficio');
        }
        return await this.benefitsRepository.save(new_benefit);
    }

    async delete(benefit: BenefitsDeleteDTO): Promise<boolean> {
        const result = await this.benefitsRepository.delete({ id_benefit: benefit.id_benefit })
        if (!result) {
            throw new NotFoundException('El beneficio que se quiere borrar no fué encontrado')
        }
        return true;
    }
}
