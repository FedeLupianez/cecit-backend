import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsEntity } from './accounts.entity';
import { Repository } from 'typeorm';
import { AccountCreateDTO } from './accounts.dto';
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
}
