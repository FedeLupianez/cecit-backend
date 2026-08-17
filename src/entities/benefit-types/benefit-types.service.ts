import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import {
    BenefitTypeDTO,
    BenefitTypeMapper,
    BenefitTypeCreateDTO,
    BenefitTypeDeleteDTO,
} from './benefit-types.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BenefitTypeEntity } from './benefit-types.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class BenefitTypeService {
    constructor(
        @InjectRepository(BenefitTypeEntity)
        private readonly benefitTypeRepository: Repository<BenefitTypeEntity>,
        @Inject(CACHE_MANAGER) private cache: Cache,
    ) { }

    async get_all(): Promise<BenefitTypeDTO[]> {
        const cached = await this.cache.get<BenefitTypeDTO[]>('benefit-types:all');
        if (cached) return cached;

        const benefitTypes = await this.benefitTypeRepository.find();
        if (!benefitTypes)
            throw new InternalServerErrorException('There is no benefits types yet');
        const benefitsTypesList = benefitTypes.map((u) =>
            BenefitTypeMapper.toDTO(u),
        );
        await this.cache.set('benefit-types:all', benefitsTypesList);
        return benefitsTypesList;
    }

    async create(benefitType: BenefitTypeCreateDTO) {
        const newBenefitType = this.benefitTypeRepository.create(benefitType);
        const result = await this.benefitTypeRepository.save(newBenefitType);
        await this.cache.del('benefit-types:all');
        return result;
    }

    async delete(benefitType: BenefitTypeDeleteDTO): Promise<boolean> {
        const result = await this.benefitTypeRepository.delete({
            id_type: benefitType.id_type,
        });
        if (!result) {
            throw new NotFoundException(
                'El tipo de beneficio que se quiere borrar no fué encontrado',
            );
        }
        await this.cache.del('benefit-types:all');
        return true;
    }

    async get_by_id(id_type: number): Promise<BenefitTypeEntity> {
        if (!id_type) throw new BadRequestException('Id is required');
        const type = await this.benefitTypeRepository.findOneBy({
            id_type: id_type,
        });
        if (!type) throw new NotFoundException('BenefitType not found');
        return type;
    }
}
