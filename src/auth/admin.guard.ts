import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PartnersService } from "src/entities/partners/partners.service";
import { PartnersAdminsService } from "src/entities/partnersadmins/partnersadmins.service";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private readonly adminsService: PartnersAdminsService,
        private readonly partnerService: PartnersService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request.user)
            throw new UnauthorizedException('Not authenticated');
        const admin = await this.adminsService.get_by_id(request.user.user_id);

        const id_partner = request.params?.id_partner ?? request.body?.id_partner;
        if (!id_partner)
            throw new NotFoundException('Partner id not found in request');
        const partner = await this.partnerService.get_by_id(id_partner);
        if (partner.id_partner != admin.id_partner)
            throw new UnauthorizedException(`PartnerAdmin with id ${admin.id_p_admin} has not access to partner ${partner.name}`);
        return true;
    }
}
