import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnersAdminsEntity } from './partnersadmins.entity';
import { Repository } from 'typeorm';
import { type PartnersAdminsCreateDTO } from './partnersadmins.dto';
import { PartnersService } from '../partners/partners.service';
import { generateUniqueId } from 'src/common/utils/id-generator';
import { AccountRole } from '../accounts/accounts.dto';
import { AccountsEntity } from '../accounts/accounts.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class PartnersAdminsService {
    constructor(
        @InjectRepository(PartnersAdminsEntity)
        private readonly adminsRepo: Repository<PartnersAdminsEntity>,
        @InjectRepository(AccountsEntity)
        private readonly accountsRepo: Repository<AccountsEntity>,
        @Inject(forwardRef(() => PartnersService))
        private readonly partnersService: PartnersService,
        @Inject(CACHE_MANAGER) private cache: Cache,
    ) { }

    async create(admin: PartnersAdminsCreateDTO): Promise<PartnersAdminsEntity> {
        const partner = await this.partnersService.get_by_name(admin.partner_name);
        const newId = await generateUniqueId(this.adminsRepo, 'id_account');
        const newAdmin = this.adminsRepo.create({
            id_account: newId,
            id_partner: partner.id_partner,
        });

        const stored = await this.adminsRepo.save(newAdmin);
        if (!stored)
            throw new InternalServerErrorException('Error creating new Admin');
        return stored;
    }

    async createByOwner(
        id_account: string,
        id_partner: string,
    ): Promise<PartnersAdminsEntity> {
        if (!id_account || !id_partner)
            throw new BadRequestException('id_account and id_partner are required');
        const newAdmin = this.adminsRepo.create({ id_account: id_account, id_partner });
        const stored = await this.adminsRepo.save(newAdmin);
        if (!stored)
            throw new InternalServerErrorException('Error creating admin by owner');
        return stored;
    }

    async get_by_id(id_admin: string): Promise<PartnersAdminsEntity> {
        if (!id_admin) throw new BadRequestException('id admin is required');
        const admin = await this.adminsRepo.findOne({
            where: { id_account: id_admin },
            relations: ['partner', 'partner.directions', 'account'],
        });
        if (!admin) throw new NotFoundException('Admin does not exists');
        return admin;
    }

    async get_all_by_account(id_account: string): Promise<PartnersAdminsEntity[]> {
        if (!id_account) throw new BadRequestException('id_account is required');
        return this.adminsRepo.find({
            where: { id_account },
            relations: ['partner', 'partner.directions'],
        });
    }

    async verify_admin(id_admin: string, id_partner: string): Promise<boolean> {
        const cacheKey = `admin-partner:${id_admin}_${id_partner}`;
        const cached = await this.cache.get<boolean>(cacheKey);
        if (cached !== undefined && cached !== null)
            return cached;

        const account = await this.accountsRepo.findOneBy({ id_account: id_admin });
        if (!account)
            throw new UnauthorizedException('User is not admin');
        if (account.role == AccountRole.USER)
            throw new UnauthorizedException('User is not admin');
        if (account.role === AccountRole.CECIT_ADMIN) {
            await this.cache.set(cacheKey, true);
            return true;
        }
        const relation = await this.adminsRepo.findOne({
            where: {
                id_account: id_admin,
                id_partner: id_partner
            },
        });
        if (!relation)
            throw new UnauthorizedException('User is not admin of this partner');
        await this.cache.set(cacheKey, true);
        return true;
    }
}
