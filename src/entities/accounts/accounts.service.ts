import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsEntity } from './accounts.entity';
import { Repository } from 'typeorm';
import {
    AccountCreateDTO,
    AccountsDTO,
    AccountsUpdateDTO,
} from './accounts.dto';
import { isEmail } from 'class-validator';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(AccountsEntity)
        private readonly accountsRepo: Repository<AccountsEntity>,
    ) { }

    async create(account: AccountCreateDTO): Promise<AccountsEntity> {
        const newAccount = this.accountsRepo.create({
            id_user: account.id_user,
            email: account.email,
            password: account.password,
        });
        const stored = await this.accountsRepo.save(newAccount);
        if (!stored) throw new InternalServerErrorException('Error saving account');
        return stored;
    }

    async get_by_email(email: string): Promise<AccountsEntity> {
        if (!email) throw new BadRequestException('Email is empty');
        if (!isEmail(email)) throw new BadRequestException('Email invalid');
        const account = await this.accountsRepo.findOneBy({
            email: email,
        });
        if (!account) throw new NotFoundException('Account not found');
        return account;
    }

    async get_by_id(id_user: string): Promise<AccountsEntity> {
        if (!id_user) throw new BadRequestException('Id is empty');
        const account = await this.accountsRepo.findOneBy({
            id_user: id_user,
        });
        if (!account) throw new NotFoundException('Account not found');
        return account;
    }

    async save(account: AccountsEntity): Promise<AccountsEntity> {
        return await this.accountsRepo.save(account);
    }

    async has_account(email: string): Promise<boolean> {
        if (!email || !isEmail(email))
            throw new BadRequestException('Email invalid');
        return await this.accountsRepo.exists({ where: { email: email } });
    }

    private toDTO(account: AccountsEntity): AccountsDTO {
        return {
            id_user: account.id_user,
            email: account.email,
            role: account.role,
            active: account.active,
            last_activity: account.last_activity,
            name: account.user?.name ?? '',
            lastname: account.user?.lastname ?? '',
            dni: account.user?.dni ?? '',
        };
    }

    async get_all(): Promise<AccountsDTO[]> {
        const accounts = await this.accountsRepo.find({
            relations: ['user'],
            order: { id_user: 'ASC' },
        });
        if (!accounts)
            throw new InternalServerErrorException('Accounts are empty');
        return accounts.map((account) => this.toDTO(account));
    }

    async update(dto: AccountsUpdateDTO): Promise<AccountsDTO> {
        if (!dto.id_user) throw new BadRequestException('Id is empty');
        const account = await this.get_by_id(dto.id_user);

        if (dto.email !== undefined) {
            const newEmail = dto.email.trim().toLowerCase();
            const inUse = await this.accountsRepo.exists({
                where: { email: newEmail },
            });
            if (inUse && newEmail !== account.email?.toLowerCase())
                throw new BadRequestException('Email already in use');
            account.email = newEmail;
        }

        if (dto.password) {
            await account.change_psswd(dto.password);
        }

        if (dto.active !== undefined) {
            account.active = dto.active;
        }

        await this.accountsRepo.save(account);
        const updated = await this.accountsRepo.findOne({
            where: { id_user: account.id_user },
            relations: ['user'],
        });
        if (!updated) throw new NotFoundException('Account not found');
        return this.toDTO(updated);
    }
}
