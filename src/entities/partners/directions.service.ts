import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Directions } from './directions.entity';
import {
    DirectionsCreateDTO,
    DirectionsDeleteDTO,
    DirectionsUpdateDTO,
} from './directions.dto';

@Injectable()
export class DirectionsService {
    constructor(
        @InjectRepository(Directions)
        private readonly repo: Repository<Directions>,
    ) { }

    async create(data: DirectionsCreateDTO): Promise<Directions> {
        const direction = this.repo.create(data);
        const saved = await this.repo.save(direction);
        if (!saved)
            throw new InternalServerErrorException('Direction was not created');
        return saved;
    }

    async createMany(
        id_partner: string,
        directions: string[],
    ): Promise<Directions[]> {
        if (!directions?.length) return [];
        const entities = directions.map((direction) =>
            this.repo.create({ id_partner, direction }),
        );
        return await this.repo.save(entities);
    }

    async findByPartner(id_partner: string): Promise<Directions[]> {
        if (!id_partner) throw new BadRequestException('id is empty');
        return await this.repo.find({ where: { id_partner } });
    }

    async update(data: DirectionsUpdateDTO): Promise<Directions> {
        const direction = await this.repo.findOneBy({ id_direction: data.id });
        if (!direction) throw new NotFoundException('Direction not found');
        direction.direction = data.direction;
        return await this.repo.save(direction);
    }

    async remove(data: DirectionsDeleteDTO): Promise<boolean> {
        const direction = await this.repo.findOneBy({ id_direction: data.id });
        if (!direction) throw new NotFoundException('Direction not found');
        const result = await this.repo.delete(direction);
        if (!result)
            throw new InternalServerErrorException('Error deleting direction');
        return true;
    }
}
