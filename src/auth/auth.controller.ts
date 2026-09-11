import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokensInterface, UpdateProfileDTO } from './auth.dto';
import { Throttle } from '@nestjs/throttler';
import { AccountCreateDTO, LoginDTO } from 'src/entities/accounts/accounts.dto';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

const REFRESH_COOKIE = 'refresh_token_cecit';
const REFRESH_DAYS = 7;

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) { }

    private get isProd(): boolean {
        return this.configService.get<string>('NODE_ENV') === 'production';
    }

    private setRefreshCookie(res, refreshToken: string): void {
        res.cookie(REFRESH_COOKIE, refreshToken, {
            httpOnly: true,
            secure: this.isProd,
            sameSite: this.isProd ? 'strict' : 'lax',
            path: '/',
            maxAge: REFRESH_DAYS * 24 * 60 * 60 * 1000,
        });
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    profile(@Req() request) {
        return request.user;
    }

    @Post('register')
    async register(
        @Body() body: AccountCreateDTO,
        @Res({ passthrough: true }) res,
    ) {
        const newTokens: TokensInterface = await this.authService.register(body);
        this.setRefreshCookie(res, newTokens.refresh_token);
        return {
            access_token: newTokens.access_token,
        };
    }

    @Post('login')
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    async login(@Body() body: LoginDTO, @Res({ passthrough: true }) res) {
        const newTokens: TokensInterface = await this.authService.login(body);
        this.setRefreshCookie(res, newTokens.refresh_token);
        return {
            access_token: newTokens.access_token,
        };
    }

    @Post('refresh')
    async refresh(@Req() req, @Res({ passthrough: true }) res) {
        const token = req.cookies[REFRESH_COOKIE];
        const newTokens = await this.authService.refresh(token);
        this.setRefreshCookie(res, newTokens.refresh_token);
        return {
            access_token: newTokens.access_token,
            profile: newTokens.profile,
        };
    }

    @Post('logout')
    async logout(@Req() req, @Res({ passthrough: true }) res) {
        const token = req.cookies[REFRESH_COOKIE];
        await this.authService.logout(token);
        res.clearCookie(REFRESH_COOKIE, { path: '/' });
        return { ok: true };
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('update')
    async updateProfile(@Body() body: UpdateProfileDTO) {
        const validUser = await this.authService.validateUser(body.email, body.current_password);
        if (!validUser)
            throw new UnauthorizedException('Invalid Credentials');
        switch (body.process) {
            case 'PASSWD':
                if (!body.new_password)
                    throw new BadRequestException('Current Password is empty');
                return await this.authService.updatePasswd(validUser.id_user, body.new_password);
            case 'EMAIL':
                if (!body.new_email)
                    throw new BadRequestException('New email is empty');
                return await this.authService.updateEmail(validUser.id_user, validUser.email, body.new_email);
        }
    }
}
