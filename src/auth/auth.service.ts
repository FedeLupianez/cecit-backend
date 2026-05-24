import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/entities/users/users.service';
import { verify } from 'argon2';
import { UserLoginDTO } from 'src/entities/users/users.dto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService) { }

    async singIn(user_login: UserLoginDTO): Promise<string> {
        const user = await this.userService.get_by_email(user_login.email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!verify(user.password, user_login.password)) {
            throw new UnauthorizedException();
        }
        // TODO: Create JWT
        const token = `${user.id_user}-${user.dni}`
        return token;
    }

}
