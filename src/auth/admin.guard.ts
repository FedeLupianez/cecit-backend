import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { AccountRole } from 'src/entities/accounts/accounts.dto';
import { PartnersAdminsService } from 'src/entities/partnersadmins/partnersadmins.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly relationService: PartnersAdminsService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request.user) throw new UnauthorizedException('Not authenticated');
        const id_user = request.user?.user_id ?? request.body?.user_id;
        if (!id_user)
            throw new NotFoundException('Partner id not found in request');
        const relation = await this.relationService.get_by_id(request.user.user_id);
        if (!relation) throw new NotFoundException('User is not Admin');

        const partner = relation.partner;
        const account = relation.account;

        if (account.role != AccountRole.PARTNER_ADMIN)
            throw new UnauthorizedException('Admin access required');
        if (relation.id_partner != partner.id_partner)
            throw new UnauthorizedException(
                `PartnerAdmin with id ${account.id_user} has not access to partner ${partner.name}`,
            );
        return true;
    }
}
