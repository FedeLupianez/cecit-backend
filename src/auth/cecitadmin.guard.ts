import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { CecitAdminsService } from "src/entities/cecit-admins/cecit-admins.service";

@Injectable()
export class CecitAdminGuard implements CanActivate {
    constructor(private readonly adminsService: CecitAdminsService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request.user)
            throw new UnauthorizedException('Not authenticated');
        const user = this.adminsService.get_by_email(request.user.email);
        if (!user)
            throw new UnauthorizedException('Admin access required');
        return true;
    }
}
