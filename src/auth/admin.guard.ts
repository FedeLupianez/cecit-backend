import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AccountRole } from "src/entities/accounts/accounts.dto";
import { AccountsService } from "src/entities/accounts/accounts.service";
import { PartnersService } from "src/entities/partners/partners.service";
import { PartnersAdminsService } from "src/entities/partnersadmins/partnersadmins.service";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private readonly relationService: PartnersAdminsService,
        private readonly partnerService: PartnersService,
        private readonly accountService: AccountsService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request.user)
            throw new UnauthorizedException('Not authenticated');
        const relation = await this.relationService.get_by_id(request.user.user_id);
        const id_partner = request.params?.id_partner ?? request.body?.id_partner;
        const id_user = request.params?.id_user ?? request.body?.id_user;

        if (!id_partner)
            throw new NotFoundException('Partner id not found in request');
        if (!id_user)
            throw new NotFoundException('Partner id not found in request');
        const partner = await this.partnerService.get_by_id(id_partner);
        const account = await this.accountService.get_by_id(id_user);
        if (account.role != AccountRole.PARTNER_ADMIN)
            throw new UnauthorizedException('Admin access required');
        if (relation.id_partner != partner.id_partner)
            throw new UnauthorizedException(`PartnerAdmin with id ${account.id_user} has not access to partner ${partner.name}`);
        return true;
    }
}
