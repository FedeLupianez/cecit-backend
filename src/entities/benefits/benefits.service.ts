import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BenefitsDTO, BenefitsCreateDTO, BenefitsDeleteDTO, BenefitsMapper } from './benefits.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BenefitsEntity } from './benefits.entity';
import { CecitAdminsEntity } from '../cecit-admins/cecit-admins.entity';
import { PartnersEntity } from '../partners/partners.entity';
import { BenefitTypeEntity } from '../benefit_type/benefit_type.entity';
import { Repository } from 'typeorm';
import { DbService } from 'src/common/database/db.service';

@Injectable()
export class BenefitsService {
    constructor(
        @InjectRepository(BenefitsEntity)
        private readonly benefitsRepository: Repository<BenefitsEntity>,

        @InjectRepository(CecitAdminsEntity)
        private readonly adminRepository: Repository<CecitAdminsEntity>,

        @InjectRepository(PartnersEntity)
        private readonly partnerRepository: Repository<PartnersEntity>,

        @InjectRepository(BenefitTypeEntity)
        private readonly benefitTypeRepository: Repository<BenefitTypeEntity>,

        @Inject() private readonly db_service: DbService
    ) { };

    async get_all(): Promise<BenefitsDTO[]> {
        const benefits = await this.benefitsRepository.find();
        if (!benefits)
            throw new InternalServerErrorException('There is no benefits yet');
        let benefits_list = benefits.map((u) => BenefitsMapper.toDTO(u));
        return benefits_list;
    }

    async create(benefit: BenefitsCreateDTO) {
        const admin: CecitAdminsEntity | null = await this.adminRepository.findOneBy({ id_c_admin: benefit.id_admin });

        if (!admin) {
            throw new NotFoundException('El administrador no existe');
        }

        const partner: PartnersEntity | null = await this.partnerRepository.findOneBy({ id_partner: benefit.id_partner });

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
