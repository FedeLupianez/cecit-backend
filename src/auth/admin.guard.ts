import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { PartnersAdminsService } from "src/entities/partnersadmins/partnersadmins.service";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly adminsService: PartnersAdminsService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request.user)
            throw new UnauthorizedException('Not authenticated');
        const user = this.adminsService.get_by_id(request.user.user_id);
        if (!user)
            throw new UnauthorizedException('Admin acces required');
        return true;
    }
}
