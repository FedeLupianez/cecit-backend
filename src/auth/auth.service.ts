import { randomUUID } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/entities/users/users.service';
import { UserLoginDTO } from 'src/entities/users/users.dto';
import { verify } from 'argon2';
import { type UsersEntity } from 'src/entities/users/users.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService, private readonly jwtService: JwtService) { }

    async validateUser(email: string, passwd: string): Promise<UsersEntity | null> {
        const user = await this.userService.get_by_email(email);

        if (!user)
            return null;

        const passwordValid = await verify(user.password, passwd);

        if (!passwordValid)
            return null;
        return user;
    }


    async login(user_login: UserLoginDTO): Promise<Record<string, string>> {
        const user = await this.validateUser(user_login.email, user_login.password);
        if (!user)
            throw new UnauthorizedException('Invalid Credentials');

        const payload = {
            sub: user.id_user,
            email: user.email,
            jti: randomUUID()
        }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }

}
