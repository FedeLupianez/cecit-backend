import {
    CanActivate,
    ExecutionContext,
    Injectable,
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
    ) { }

    private extractPartnerId(request: any): string | undefined {
        // id_partner puede venir por params, query o body según el endpoint:
        //  - GET /benefits/partner?id_partner=xxx  -> query
        //  - GET /partners/locations?id_partner=xxx -> query
        //  - PATCH /partners/logo { id_partner }    -> body
        //  - POST /directions { id_partner }        -> body
        const fromParams = request.params?.id_partner ?? request.params?.idPartner;
        const fromQuery = request.query?.id_partner ?? request.query?.idPartner;
        const fromBody = request.body?.id_partner ?? request.body?.idPartner;
        const raw = fromParams ?? fromQuery ?? fromBody;
        if (typeof raw === 'string' && raw.trim().length > 0) return raw.trim();
        if (raw != null && String(raw).trim().length > 0) return String(raw).trim();
        return undefined;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request.user) throw new UnauthorizedException('Not authenticated');

        const userId: string = request.user.user_id ?? request.user.sub;
        const jwtRole: AccountRole | undefined = request.user.role;
        const partnerId = this.extractPartnerId(request);

        // Fast-path: rol firmado en el JWT (access token de corta vida).
        // CECIT_ADMIN pasa directo. PARTNER_ADMIN pasa si no hay partner
        // específico que validar; si hay id_partner se verifica contra DB.
        if (jwtRole === AccountRole.CECIT_ADMIN) return true;
        if (jwtRole === AccountRole.PARTNER_ADMIN) {
            if (partnerId) {
                await this.relationService.verify_admin(userId, partnerId);
            }
            return true;
        }
        if (jwtRole) {
            // JWT trae rol pero no es admin (p.ej. USER)
            throw new UnauthorizedException('Admin access required');
        }

        // Fallback DB: token viejo sin rol o rol cambiado. Fuente de verdad.
        const account = await this.accountService.get_by_id(userId);
        if (account.role === AccountRole.CECIT_ADMIN) return true;
        if (account.role !== AccountRole.PARTNER_ADMIN)
            throw new UnauthorizedException('Admin access required');

        if (partnerId) {
            await this.relationService.verify_admin(userId, partnerId);
        } else {
            // Sin partner objetivo solo validamos que exista al menos una
            // relación partner-admin (evita JWT spoofeado sin DB).
            const relations = await this.relationService.get_all_by_account(userId);
            if (!relations.length)
                throw new UnauthorizedException('User is not Admin of any partner');
        }

        return true;
    }
}
