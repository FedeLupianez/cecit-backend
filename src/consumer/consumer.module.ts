import { Module } from '@nestjs/common';
import { CecitAdminsModule } from 'src/entities/cecit-admins/cecit-admins.module';
import { PartnersAdminsModule } from 'src/entities/partnersadmins/partnersadmins.module';
import { UsersModule } from 'src/entities/users/users.module';
import { ConsumerService } from './consumer.service';

@Module({
    imports: [UsersModule, PartnersAdminsModule, CecitAdminsModule],
    providers: [ConsumerService],
    exports: [ConsumerService]
})
export class ConsumerModule { }
