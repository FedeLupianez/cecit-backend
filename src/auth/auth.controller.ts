import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokensInterface } from './auth.dto';
import { Throttle } from '@nestjs/throttler';
import { AccountCreateDTO, LoginDTO } from 'src/entities/accounts/accounts.dto';
import { AuthGuard } from '@nestjs/passport';

const secure_cookies = process.env.NODE_ENV === 'production';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

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
        const days: number = 7;
        res.cookie('refresh_token_cecit', newTokens.refresh_token, {
            httpOnly: true,
            secure: secure_cookies,
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            path: '/',
            maxAge: days * 24 * 60 * 60 * 1000,
        });
        return {
            access_token: newTokens.access_token,
        };
    }

    @Post('login')
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    async login(@Body() body: LoginDTO, @Res({ passthrough: true }) res) {
        const newTokens: TokensInterface = await this.authService.login(body);
        const days: number = 7;
        res.cookie('refresh_token_cecit', newTokens.refresh_token, {
            httpOnly: true,
            secure: secure_cookies,
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            path: '/',
            maxAge: days * 24 * 60 * 60 * 1000,
        });
        return {
            access_token: newTokens.access_token,
        };
    }

    @Post('refresh')
    async refresh(@Req() req, @Res({ passthrough: true }) res) {
        const token = req.cookies['refresh_token_cecit'];
        const newTokens: TokensInterface = await this.authService.refresh(token);
        const days: number = 7;
        res.cookie('refresh_token_cecit', newTokens.refresh_token, {
            httpOnly: true,
            secure: secure_cookies,
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            path: '/',
            maxAge: days * 24 * 60 * 60 * 1000,
        });
        return {
            access_token: newTokens.access_token,
        };
    }

    @Post('logout')
    async logout(@Req() req) {
        const token = req.cookies['refresh_token_cecit'];
        await this.authService.logout(token);
    }
}
