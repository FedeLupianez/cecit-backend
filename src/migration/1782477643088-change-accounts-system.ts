import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeAccountsSystem1782477643088 implements MigrationInterface {
    name = 'ChangeAccountsSystem1782477643088';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`RefreshTokens\` (\`id_token\` uuid NOT NULL, \`token_hash\` varchar(255) NOT NULL, \`expires_at\` datetime NOT NULL, \`revoked\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_a8902d4754e89411bbc04a9774\` (\`token_hash\`), PRIMARY KEY (\`id_token\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`Users\` (\`id_user\` varchar(4) NOT NULL, \`name\` varchar(50) NOT NULL, \`last_name\` varchar(50) NOT NULL, \`dni\` varchar(8) NOT NULL, INDEX \`IDX_d9de24daa15c9441939de28998\` (\`dni\`), PRIMARY KEY (\`id_user\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`BenefitTypes\` (\`id_type\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id_type\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`Partners\` (\`id_partner\` varchar(4) NOT NULL, \`name\` varchar(50) NOT NULL, \`logo\` varchar(255) NOT NULL, \`direction\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id_partner\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`Accounts\` (\`id_user\` varchar(4) NOT NULL, \`email\` varchar(50) NULL, \`password\` varchar(50) NULL, \`role\` enum ('0', '1', '2') NOT NULL, \`last_activity\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(), \`active\` tinyint NOT NULL DEFAULT 1, INDEX \`IDX_0c9042702a3047d28d0a1e68d2\` (\`role\`), UNIQUE INDEX \`IDX_0c5666efc38b6f023b7814c73d\` (\`email\`), PRIMARY KEY (\`id_user\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`Benefits\` (\`id_benefit\` varchar(4) NOT NULL, \`id_admin\` varchar(4) NOT NULL, \`id_partner\` varchar(4) NOT NULL, \`date_entered\` date NOT NULL DEFAULT CURRENT_DATE, \`start_date\` date NOT NULL, \`end_date\` date NOT NULL, \`image\` varchar(100) NOT NULL, \`title\` varchar(100) NOT NULL, \`description\` varchar(500) NOT NULL, \`status\` enum ('ACTIVE', 'INACTIVE', 'PENDING') NOT NULL DEFAULT 'ACTIVE', \`id_type\` int NOT NULL, \`max_coupons\` int NOT NULL, \`coupons\` int NOT NULL, PRIMARY KEY (\`id_benefit\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`Vouchers\` (\`token\` varchar(6) NOT NULL, \`id_user\` varchar(4) NOT NULL, \`id_benefit\` varchar(4) NOT NULL, \`application_date\` date NOT NULL, \`delivery_date\` date NULL, \`status\` enum ('PENDING', 'DELIVERED', 'EXPIRED') NOT NULL DEFAULT 'PENDING', PRIMARY KEY (\`token\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`PaymentMethods\` (\`id_payment_method\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id_payment_method\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`PaymentMethods_Benefits\` (\`id_payment_method\` int NOT NULL, \`id_benefit\` varchar(4) NOT NULL, PRIMARY KEY (\`id_payment_method\`, \`id_benefit\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`Partners_Admins\` (\`id_account\` varchar(4) NOT NULL, \`id_partner\` varchar(4) NOT NULL, PRIMARY KEY (\`id_account\`, \`id_partner\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`Categories\` (\`id_category\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`icon_url\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id_category\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`Partners_Categories\` (\`id_partner\` varchar(4) NOT NULL, \`id_category\` int NOT NULL, PRIMARY KEY (\`id_partner\`, \`id_category\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`Benefits\` ADD CONSTRAINT \`FK_be1f417d247c4ed000122215073\` FOREIGN KEY (\`id_admin\`) REFERENCES \`Accounts\`(\`id_user\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`Benefits\` ADD CONSTRAINT \`FK_65a8f16542b510030db783acad9\` FOREIGN KEY (\`id_partner\`) REFERENCES \`Partners\`(\`id_partner\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`Benefits\` ADD CONSTRAINT \`FK_5e94172c6086dc52ffcda3b1236\` FOREIGN KEY (\`id_type\`) REFERENCES \`BenefitTypes\`(\`id_type\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`Vouchers\` ADD CONSTRAINT \`FK_6b12837b829dc6fed5b497dcae8\` FOREIGN KEY (\`id_user\`) REFERENCES \`Users\`(\`id_user\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`Vouchers\` ADD CONSTRAINT \`FK_dd90256db2b710c434669594a31\` FOREIGN KEY (\`id_benefit\`) REFERENCES \`Benefits\`(\`id_benefit\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`PaymentMethods_Benefits\` ADD CONSTRAINT \`FK_1020856c55a0eabf5757f6f60b0\` FOREIGN KEY (\`id_payment_method\`) REFERENCES \`PaymentMethods\`(\`id_payment_method\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`PaymentMethods_Benefits\` ADD CONSTRAINT \`FK_fde159496e03a8c7dc3501b22f3\` FOREIGN KEY (\`id_benefit\`) REFERENCES \`Benefits\`(\`id_benefit\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`Partners_Admins\` ADD CONSTRAINT \`FK_dc285106d5fcee21e1338908db1\` FOREIGN KEY (\`id_partner\`) REFERENCES \`Partners\`(\`id_partner\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`Partners_Admins\` ADD CONSTRAINT \`FK_b43cdde5e6118c5bae9670806a5\` FOREIGN KEY (\`id_account\`) REFERENCES \`Accounts\`(\`id_user\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`Partners_Categories\` ADD CONSTRAINT \`FK_7e2fb3a7071b5ee263a93592190\` FOREIGN KEY (\`id_partner\`) REFERENCES \`Partners\`(\`id_partner\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`Partners_Categories\` ADD CONSTRAINT \`FK_feb99400dd667ee0d4eb6918487\` FOREIGN KEY (\`id_category\`) REFERENCES \`Categories\`(\`id_category\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`Partners_Categories\` DROP FOREIGN KEY \`FK_feb99400dd667ee0d4eb6918487\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`Partners_Categories\` DROP FOREIGN KEY \`FK_7e2fb3a7071b5ee263a93592190\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`Partners_Admins\` DROP FOREIGN KEY \`FK_b43cdde5e6118c5bae9670806a5\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`Partners_Admins\` DROP FOREIGN KEY \`FK_dc285106d5fcee21e1338908db1\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`PaymentMethods_Benefits\` DROP FOREIGN KEY \`FK_fde159496e03a8c7dc3501b22f3\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`PaymentMethods_Benefits\` DROP FOREIGN KEY \`FK_1020856c55a0eabf5757f6f60b0\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`Vouchers\` DROP FOREIGN KEY \`FK_dd90256db2b710c434669594a31\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`Vouchers\` DROP FOREIGN KEY \`FK_6b12837b829dc6fed5b497dcae8\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`Benefits\` DROP FOREIGN KEY \`FK_5e94172c6086dc52ffcda3b1236\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`Benefits\` DROP FOREIGN KEY \`FK_65a8f16542b510030db783acad9\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`Benefits\` DROP FOREIGN KEY \`FK_be1f417d247c4ed000122215073\``,
        );
        await queryRunner.query(`DROP TABLE \`Partners_Categories\``);
        await queryRunner.query(`DROP TABLE \`Categories\``);
        await queryRunner.query(`DROP TABLE \`Partners_Admins\``);
        await queryRunner.query(`DROP TABLE \`PaymentMethods_Benefits\``);
        await queryRunner.query(`DROP TABLE \`PaymentMethods\``);
        await queryRunner.query(`DROP TABLE \`Vouchers\``);
        await queryRunner.query(`DROP TABLE \`Benefits\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_0c5666efc38b6f023b7814c73d\` ON \`Accounts\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_0c9042702a3047d28d0a1e68d2\` ON \`Accounts\``,
        );
        await queryRunner.query(`DROP TABLE \`Accounts\``);
        await queryRunner.query(`DROP TABLE \`Partners\``);
        await queryRunner.query(`DROP TABLE \`BenefitTypes\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_d9de24daa15c9441939de28998\` ON \`Users\``,
        );
        await queryRunner.query(`DROP TABLE \`Users\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_a8902d4754e89411bbc04a9774\` ON \`RefreshTokens\``,
        );
        await queryRunner.query(`DROP TABLE \`RefreshTokens\``);
    }
}
