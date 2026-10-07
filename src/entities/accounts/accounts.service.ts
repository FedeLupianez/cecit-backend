import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsEntity } from './accounts.entity';
import { PartnersAdminsEntity } from '../partnersadmins/partnersadmins.entity';
import { Repository } from 'typeorm';
import {
  AccountCreateDTO,
  AccountRole,
  AccountsDTO,
  AccountsUpdateDTO,
  UpdateRoleDTO,
} from './accounts.dto';
import { isEmail } from 'class-validator';
import { PartnersEntity } from '../partners/partners.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { adminPartnerCacheKey } from '../../common/utils/admin-cache';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountsEntity)
    private readonly accountsRepo: Repository<AccountsEntity>,
    @InjectRepository(PartnersAdminsEntity)
    private readonly partnersAdminsRepo: Repository<PartnersAdminsEntity>,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async create(account: AccountCreateDTO): Promise<AccountsEntity> {
    const newAccount = this.accountsRepo.create({
      id_account: account.id_account,
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

  async get_by_id(id_account: string): Promise<AccountsEntity> {
    if (!id_account) throw new BadRequestException('Id is empty');
    const account = await this.accountsRepo.findOneBy({
      id_account: id_account,
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
      id_account: account.id_account,
      email: account.email,
      role: account.role,
      active: account.active,
      name: account.user?.name ?? '',
      lastname: account.user?.lastname ?? '',
      dni: account.user?.dni ?? '',
    };
  }

  async get_all(): Promise<AccountsDTO[]> {
    const accounts = await this.accountsRepo.find({
      relations: ['user'],
      order: { id_account: 'ASC' },
    });
    if (!accounts) throw new InternalServerErrorException('Accounts are empty');
    return accounts.map((account) => this.toDTO(account));
  }

  async update(dto: AccountsUpdateDTO): Promise<AccountsDTO> {
    if (!dto.id_account) throw new BadRequestException('Id is empty');
    const account = await this.get_by_id(dto.id_account);

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
      where: { id_account: account.id_account },
      relations: ['user'],
    });
    if (!updated) throw new NotFoundException('Account not found');
    return this.toDTO(updated);
  }

  /**
   * Da de baja la cuenta (login) sin borrar la fila: puede tener vouchers,
   * beneficios o pagos históricos asociados.
   */
  async deactivate(id_account: string): Promise<boolean> {
    if (!id_account) throw new BadRequestException('id_account is required');
    const account = await this.accountsRepo.findOneBy({ id_account });
    if (!account) return false;
    if (!account.active) return true;
    account.active = false;
    await this.accountsRepo.save(account);
    return true;
  }

  async changeRole(
    user: UpdateRoleDTO & Record<string, any>,
  ): Promise<boolean> {
    const id_account: string | undefined = user.id_account;
    const rawRole: string | undefined =
      user.newRole ?? user.role ?? user.new_role;
    const id_partner: string | undefined = user.id_partner ?? user.idPartner;
    const newRole = rawRole as AccountRole | undefined;

    if (!id_account) return false;
    if (!newRole)
      throw new BadRequestException('newRole (or role) is required');
    if (!Object.values(AccountRole).includes(newRole))
      throw new BadRequestException(`Invalid role: ${newRole}`);
    const account = await this.accountsRepo.findOneBy({ id_account });
    if (!account) throw new NotFoundException('User has not account');

    if (newRole === AccountRole.USER) {
      const relations = await this.partnersAdminsRepo.find({
        where: { id_account: id_account },
        relations: ['account', 'partner'],
      });
      const partner: PartnersEntity | undefined = relations.find(
        (p) => p.id_partner === id_partner,
      )?.partner;
      if (account.id_account == partner?.id_owner)
        throw new BadRequestException('User is the owner');
      // Si es PARTNER_ADMIN de un solo negocio, cambiar el role
      if (
        (account.role === AccountRole.PARTNER_ADMIN && relations.length <= 1) ||
        !relations
      )
        await this.accountsRepo.update(
          { id_account: account.id_account },
          { role: newRole },
        );

      // El rol pasó a USER, así que cualquier acierto cacheado queda viejo y
      // dejaría acceso hasta que expire el TTL. Se limpian todas las
      // relaciones porque el cambio de rol es global, no por partner.
      await this.invalidateAdminCache(id_account, relations);
    }

    if (newRole === AccountRole.PARTNER_ADMIN) {
      if (!id_partner)
        throw new BadRequestException(
          'id_partner is required when newRole is PARTNER_ADMIN',
        );

      const exists = await this.partnersAdminsRepo.exists({
        where: { id_account, id_partner },
      });
      if (!exists) {
        const newAdmin = this.partnersAdminsRepo.create({
          id_account,
          id_partner,
        });
        const stored = await this.partnersAdminsRepo.save(newAdmin);
        if (!stored)
          throw new InternalServerErrorException(
            'Error creating Partners_Admins record',
          );
      }
      await this.accountsRepo.update(
        { id_account: account.id_account },
        { role: newRole },
      );
    }

    // El alta como PARTNER_ADMIN no necesita invalidar: los rechazos nunca se
    // cachean, así que el permiso nuevo ya aplica en la petición siguiente.
    return true;
  }

  /**
   * Borra los aciertos cacheados de verify_admin para un account. Sin esto, un
   * admin degradado a USER conservaría acceso a los endpoints de su partner
   * hasta que expirara el TTL.
   */
  private async invalidateAdminCache(
    id_account: string,
    relations: PartnersAdminsEntity[],
  ): Promise<void> {
    const keys = relations.map((r) =>
      adminPartnerCacheKey(id_account, r.id_partner),
    );
    if (!keys.length) return;
    await this.cache.mdel(keys);
  }

  // Helpers used by AdminGuard para evitar dependencia circular con PartnersAdminsService
  async verify_admin(id_admin: string, id_partner: string): Promise<boolean> {
    if (!id_admin || !id_partner)
      throw new BadRequestException('id_admin and id_partner are required');

    // AdminGuard corre esto en cada request a endpoint de partner, así que
    // el acierto se cachea para evitar las dos queries por request. Solo se
    // cachean aciertos: un rechazo siempre vuelve a DB, así un alta de
    // permisos aplica en la petición siguiente sin esperar el TTL.
    const cacheKey = adminPartnerCacheKey(id_admin, id_partner);
    const cached = await this.cache.get<boolean>(cacheKey);
    if (cached) return true;

    const account = await this.accountsRepo.findOneBy({ id_account: id_admin });
    if (!account) throw new UnauthorizedException('User is not admin');
    if (account.role === AccountRole.USER)
      throw new UnauthorizedException('User is not admin');
    if (account.role === AccountRole.CECIT_ADMIN) {
      await this.cache.set(cacheKey, true);
      return true;
    }
    const relation = await this.partnersAdminsRepo.findOne({
      where: { id_account: id_admin, id_partner },
    });
    if (!relation)
      throw new UnauthorizedException('User is not admin of this partner');
    await this.cache.set(cacheKey, true);
    return true;
  }

  async get_all_by_account(
    id_account: string,
  ): Promise<PartnersAdminsEntity[]> {
    if (!id_account) throw new BadRequestException('id_account is required');
    return this.partnersAdminsRepo.find({ where: { id_account } });
  }
}
