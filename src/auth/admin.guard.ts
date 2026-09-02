import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { AccountRole } from 'src/entities/accounts/accounts.dto';
import { AccountsService } from 'src/entities/accounts/accounts.service';
import { PartnersAdminsService } from 'src/entities/partnersadmins/partnersadmins.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private readonly relationService: PartnersAdminsService,
        private readonly accountService: AccountsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request.user) throw new UnauthorizedException('Not authenticated');

        const account = await this.accountService.get_by_email(request.user.email);
        if (!account) throw new NotFoundException('Account not found');
        if (account.role === AccountRole.CECIT_ADMIN) return true;

        const id_user = request.user?.user_id ?? request.body?.user_id;
        if (!id_user)
            throw new NotFoundException('Partner id not found in request');
        const relation = await this.relationService.get_by_id(request.user.user_id);
        if (!relation) throw new NotFoundException('User is not Admin');

        const partner = relation.partner;

        if (account.role != AccountRole.PARTNER_ADMIN)
            throw new UnauthorizedException('Admin access required');
        if (relation.id_partner != partner.id_partner)
            throw new UnauthorizedException(
                `PartnerAdmin with id ${account.id_user} has not access to partner ${partner.name}`,
            );
        return true;
    }
}
