import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import type {
    AddEmployeeDTO,
    AddLocationDTO,
    GetLocationsReturn,
    PartnersCreateDTO,
    PartnersDTO,
    PartnersUpdateLogoDTO,
    PartnersUpdateNameDTO,
} from './partners.dto';
import { PartnersEntity } from './partners.entity';
import { PartnersMapper } from './partners.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DirectionsService } from './directions.service';
import { generateUniqueId } from 'src/common/utils/id-generator';
import { AccountsService } from '../accounts/accounts.service';
import { AccountsEntity } from '../accounts/accounts.entity';
import { AccountRole } from '../accounts/accounts.dto';
import { PartnersAdminsService } from '../partnersadmins/partnersadmins.service';
import { UsersEntity } from '../users/users.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class PartnersService {
    constructor(
        @InjectRepository(PartnersEntity)
        private readonly partnersRepo: Repository<PartnersEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepo: Repository<UsersEntity>,
        @InjectRepository(AccountsEntity)
        private readonly accountsRepo: Repository<AccountsEntity>,
        private readonly directionsService: DirectionsService,
        private readonly accountsService: AccountsService,
        private readonly usersService: UsersService,
        @Inject(forwardRef(() => PartnersAdminsService))
        private readonly partnersAdminsService: PartnersAdminsService,
    ) { }

    private async assertPartnerAccess(callerId: string, id_partner: string): Promise<void> {
        if (!callerId) throw new BadRequestException('Caller id is required');
        if (!id_partner) throw new BadRequestException('id is empty');
        const caller = await this.accountsService.get_by_id(callerId);
        if (caller?.role === AccountRole.CECIT_ADMIN) return;
        await this.partnersAdminsService.verify_admin(callerId, id_partner);
    }

    async get_all(): Promise<PartnersDTO[]> {
        const partners = await this.partnersRepo.find({
            relations: { directions: true },
            order: { name: 'ASC' },
        });
        if (!partners) throw new NotFoundException('Partners are empty');
        return partners.map((partner) =>
            PartnersMapper.entityToDto(partner),
        );
    }

    async create(partner: PartnersCreateDTO): Promise<PartnersEntity> {
        const newId = await generateUniqueId(this.partnersRepo, 'id_partner');
        const newPartner = this.partnersRepo.create({
            id_partner: newId,
            name: partner.partner_name.toLowerCase(),
            logo: partner.logo,
        });
        const storedPartner = await this.partnersRepo.save(newPartner);
        if (!storedPartner) {
            throw new InternalServerErrorException('Partner was not created');
        }
        if (partner.directions?.length) {
            await this.directionsService.createMany(newId, partner.directions);
        }
        return storedPartner;
    }

    async remove(id: string): Promise<boolean> {
        if (!id) throw new BadRequestException('id is empty');
        const partner = await this.partnersRepo.findOneBy({ id_partner: id });
        if (!partner) throw new NotFoundException('Partner not found');
        const result = await this.partnersRepo.delete(partner);
        if (!result)
            throw new InternalServerErrorException('Error deleting partner');
        return true;
    }

    async get_by_id(id_partner: string): Promise<PartnersEntity> {
        if (!id_partner) throw new BadRequestException('id is empty');
        const partner = await this.partnersRepo.findOneBy({
            id_partner: id_partner,
        });
        if (!partner) throw new NotFoundException('Partner not found');
        return partner;
    }

    async get_by_id_with_categories(id_partner: string): Promise<PartnersEntity> {
        if (!id_partner) throw new BadRequestException('id is empty');
        const partner = await this.partnersRepo.findOne({
            where: { id_partner },
            relations: ['categories'],
        });
        if (!partner) throw new NotFoundException('Partner not found');
        return partner;
    }

    async get_by_name(name: string): Promise<PartnersDTO> {
        if (!name) throw new BadRequestException('partner name is empty');
        const stored = await this.partnersRepo.findOne({
            where: { name: name },
            relations: { directions: true },
        });
        if (!stored) throw new NotFoundException('Partner not exists');
        return PartnersMapper.entityToDto(stored);
    }

    async updateLogo(data: PartnersUpdateLogoDTO, callerId: string): Promise<PartnersDTO> {
        await this.assertPartnerAccess(callerId, data.id_partner);
        const partner = await this.partnersRepo.findOneBy({ id_partner: data.id_partner });
        if (!partner) throw new BadRequestException('Partner not exists');
        partner.logo = data.new_logo;
        await this.partnersRepo.save(partner);
        return PartnersMapper.entityToDto(partner);
    }

    async updateName(data: PartnersUpdateNameDTO, callerId: string): Promise<PartnersDTO> {
        await this.assertPartnerAccess(callerId, data.id_partner);
        const partner = await this.partnersRepo.findOneBy({
            id_partner: data.id_partner,
        });
        if (!partner) throw new BadRequestException('Partner not exists');
        partner.name = data.new_name.toLowerCase();
        await this.partnersRepo.save(partner);
        return PartnersMapper.entityToDto(partner);
    }

    async getByOwnerId(id_owner: string): Promise<PartnersEntity | null> {
        return await this.partnersRepo.findOne({
            where: {
                id_owner,
            },
        });
    }

    async addLocation({ id_partner, direction }: AddLocationDTO, callerId: string): Promise<boolean> {
        await this.assertPartnerAccess(callerId, id_partner);
        const partner = await this.partnersRepo.findOneBy({ id_partner });
        if (!partner) throw new NotFoundException('Partner not found');
        await this.directionsService.create({ id_partner, direction }, callerId);
        return true;
    }

    async getLocations(id_partner: string): Promise<GetLocationsReturn[]> {
        const directions = await this.directionsService.findByPartner(id_partner);
        return directions.map((d) => {
            return {
                id_partner: d.id_partner,
                id_location: d.id_direction,
                direction: d.direction
            }
        })
    }

    async getEmployees(id_partner: string): Promise<(UsersEntity & { email: string | null; role: AccountRole | null })[]> {
        const partner = await this.partnersRepo.findOne({ where: { id_partner: id_partner }, relations: ['employees'] });
        if (!partner)
            throw new NotFoundException('Partner not found');
        if (!partner.employees?.length) return [];
        const employeeIds = partner.employees.map((e) => e.id_user);
        const accounts = await this.accountsRepo.find({
            where: { id_account: In(employeeIds) },
        });
        const accountById = new Map(accounts.map((a) => [a.id_account, a]));
        return partner.employees.map((employee) => {
            const account = accountById.get(employee.id_user);
            return {
                ...employee,
                email: account?.email ?? null,
                role: account?.role ?? null,
            };
        });
    }

    async addEmployee(callerId: string, employee: AddEmployeeDTO): Promise<(UsersEntity & { email: string | null; role: AccountRole | null })[]> {
        await this.assertPartnerAccess(callerId, employee.id_partner);

        const partner = await this.partnersRepo.findOne({ where: { id_partner: employee.id_partner }, relations: ['employees'] });
        if (!partner) throw new NotFoundException('Partner not found');

        const user = await this.usersService.get_by_dni(employee.dni);
        if (partner.employees.some((e) => e.id_user === user.id_user)) {
            throw new BadRequestException('User is already an employee of this partner');
        }

        await this.partnersRepo
            .createQueryBuilder()
            .relation(PartnersEntity, 'employees')
            .of(employee.id_partner)
            .add(user.id_user);

        return this.getEmployees(employee.id_partner);
    }

    async removeEmployee(id_partner: string, callerId: string, dni: string): Promise<(UsersEntity & { email: string | null; role: AccountRole | null })[]> {
        if (!id_partner) throw new BadRequestException('id_partner is empty');
        if (!dni) throw new BadRequestException('dni is required');
        await this.assertPartnerAccess(callerId, id_partner);

        const partner = await this.partnersRepo.findOne({ where: { id_partner }, relations: ['employees'] });
        if (!partner) throw new NotFoundException('Partner not found');

        // Busca directo en Users por dni (no toca Accounts)
        const user = await this.usersRepo.findOneBy({ dni });
        if (!user) throw new NotFoundException('User not found for dni');

        if (!partner.employees.some((e) => e.id_user === user.id_user)) {
            throw new NotFoundException('User is not an employee of this partner');
        }
        // Si el usuario es owner no se puede borrar
        if (partner.id_owner === user.id_user)
            throw new BadRequestException('User is owner, can not delete him');

        await this.partnersRepo
            .createQueryBuilder()
            .relation(PartnersEntity, 'employees')
            .of(id_partner)
            .remove(user.id_user);

        await this.accountsService.changeRole({ id_partner: id_partner, id_account: user.id_user, newRole: AccountRole.USER });
        return this.getEmployees(id_partner);
    }
}
