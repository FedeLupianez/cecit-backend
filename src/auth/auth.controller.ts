import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokensInterface } from './auth.dto';
import type { RefreshTokenDTO } from './auth.dto';
import { Throttle } from '@nestjs/throttler';
import { AccountCreateDTO, LoginDTO } from 'src/entities/accounts/accounts.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() body: AccountCreateDTO, @Res({ passthrough: true }) res) {
        const new_tokens: TokensInterface = await this.authService.register(body);
        const days: number = 7;
        res.cookie('refresh_token_cecit', new_tokens.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: days * 60 * 60 * 24
        });
        return {
            access_token: new_tokens.access_token
        }
    }

    @Post('login')
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    async login(@Body() body: LoginDTO, @Res({ passthrough: true }) res) {
        const new_tokens: TokensInterface = await this.authService.login(body);
        const days: number = 7;
        res.cookie('refresh_token_cecit', new_tokens.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: days * 60 * 60 * 24
        });
        return {
            access_token: new_tokens.access_token
        }
    }

    @Post('refresh')
    async refresh(@Body() body: RefreshTokenDTO, @Req() req, @Res({ passthrough: true }) res) {
        const token = req.cookies['refresh_token_cecit'];
        await this.authService.validateRefreshToken(token);
        const new_tokens: TokensInterface = await this.authService.refresh(body);
        const days: number = 7;
        res.cookie('refresh_token_cecit', new_tokens.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: days * 60 * 60 * 24
        });
        return {
            access_token: new_tokens.access_token
        }
    }

    @Post('logout')
    async logout(@Req() req) {
        const token = req.cookies['refresh_token_cecit'];
        await this.authService.validateRefreshToken(token);
        await this.authService.logout(token);
    }
}
