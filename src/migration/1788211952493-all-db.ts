import { MigrationInterface, QueryRunner } from "typeorm";

export class AllDb1788211952493 implements MigrationInterface {
    name = 'AllDb1788211952493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Users\` (\`id_user\` varchar(4) NOT NULL, \`name\` varchar(50) NOT NULL, \`lastname\` varchar(50) NOT NULL, \`dni\` varchar(8) NOT NULL, INDEX \`IDX_d9de24daa15c9441939de28998\` (\`dni\`), PRIMARY KEY (\`id_user\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Accounts\` (\`id_user\` varchar(4) NOT NULL, \`email\` varchar(50) NULL, \`password\` varchar(255) NULL, \`role\` enum ('USER', 'CECIT_ADMIN', 'PARTNER_ADMIN') NOT NULL DEFAULT 'USER', \`last_activity\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(), \`active\` tinyint NOT NULL DEFAULT 1, INDEX \`IDX_0c5666efc38b6f023b7814c73d\` (\`email\`), INDEX \`IDX_0c9042702a3047d28d0a1e68d2\` (\`role\`), UNIQUE INDEX \`IDX_0c5666efc38b6f023b7814c73d\` (\`email\`), PRIMARY KEY (\`id_user\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`RefreshTokens\` (\`id_token\` uuid NOT NULL, \`token_hash\` varchar(255) NOT NULL, \`email\` varchar(50) NOT NULL, \`expires_at\` datetime NOT NULL, \`revoked\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id_token\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`BenefitTypes\` (\`id_type\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id_type\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Categories\` (\`id_category\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`icon_url\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id_category\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Partners_Categories\` (\`id_partner\` varchar(4) NOT NULL, \`id_category\` int NOT NULL, PRIMARY KEY (\`id_partner\`, \`id_category\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Partners\` (\`id_partner\` varchar(4) NOT NULL, \`name\` varchar(50) NOT NULL, \`logo\` varchar(255) NOT NULL, \`id_owner\` varchar(4) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`REL_4d9e114868b838c8a507e386ac\` (\`id_owner\`), PRIMARY KEY (\`id_partner\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Benefits\` (\`id_benefit\` varchar(4) NOT NULL, \`id_admin\` varchar(4) NOT NULL, \`id_partner\` varchar(4) NOT NULL, \`date_entered\` date NOT NULL DEFAULT CURRENT_DATE, \`start_date\` date NOT NULL, \`end_date\` date NOT NULL, \`image\` varchar(500) NOT NULL, \`title\` varchar(100) NOT NULL, \`description\` varchar(500) NOT NULL, \`status\` enum ('ACTIVE', 'INACTIVE', 'PENDING') NOT NULL DEFAULT 'ACTIVE', \`id_type\` int NOT NULL, \`max_coupons\` int NOT NULL, \`coupons\` int NOT NULL, \`max_per_user\` int NOT NULL DEFAULT '3', INDEX \`IDX_a16720258707094a7b428c97bb\` (\`date_entered\`), INDEX \`IDX_7e9400ee7b86f7a09c84d40d9a\` (\`start_date\`), INDEX \`IDX_20cb92aacb351dc0b03e4000f3\` (\`end_date\`), INDEX \`IDX_6b0b4658559d4b81a0d54dadb4\` (\`status\`), INDEX \`IDX_5ad4aa48976a5fa65c352fb287\` (\`coupons\`), PRIMARY KEY (\`id_benefit\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Vouchers\` (\`token\` varchar(6) NOT NULL, \`id_user\` varchar(4) NOT NULL, \`id_benefit\` varchar(4) NOT NULL, \`application_date\` date NOT NULL, \`delivery_date\` date NULL, \`limit_date\` date NOT NULL DEFAULT '2026-05-11', \`status\` enum ('PENDING', 'DELIVERED', 'EXPIRED', 'REJECTED') NOT NULL DEFAULT 'PENDING', PRIMARY KEY (\`token\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`PaymentMethods\` (\`id_payment_method\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id_payment_method\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`PaymentMethods_Benefits\` (\`id_payment_method\` int NOT NULL, \`id_benefit\` varchar(4) NOT NULL, PRIMARY KEY (\`id_payment_method\`, \`id_benefit\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Partners_Admins\` (\`id_user\` varchar(4) NOT NULL, \`id_partner\` varchar(4) NOT NULL, PRIMARY KEY (\`id_user\`, \`id_partner\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Directions\` (\`id_partner\` varchar(4) NOT NULL, \`direction\` varchar(150) NOT NULL, PRIMARY KEY (\`id_partner\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Partners\` ADD \`direction\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Accounts\` ADD CONSTRAINT \`FK_ef4e45b5f5c3bc64d66142cbcbb\` FOREIGN KEY (\`id_user\`) REFERENCES \`Users\`(\`id_user\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` ADD CONSTRAINT \`FK_f85c169d27ed0e5a8e87434ff55\` FOREIGN KEY (\`email\`) REFERENCES \`Accounts\`(\`email\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Partners_Categories\` ADD CONSTRAINT \`FK_7e2fb3a7071b5ee263a93592190\` FOREIGN KEY (\`id_partner\`) REFERENCES \`Partners\`(\`id_partner\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Partners_Categories\` ADD CONSTRAINT \`FK_feb99400dd667ee0d4eb6918487\` FOREIGN KEY (\`id_category\`) REFERENCES \`Categories\`(\`id_category\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Partners\` ADD CONSTRAINT \`FK_4d9e114868b838c8a507e386acf\` FOREIGN KEY (\`id_owner\`) REFERENCES \`Users\`(\`id_user\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` ADD CONSTRAINT \`FK_be1f417d247c4ed000122215073\` FOREIGN KEY (\`id_admin\`) REFERENCES \`Accounts\`(\`id_user\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` ADD CONSTRAINT \`FK_65a8f16542b510030db783acad9\` FOREIGN KEY (\`id_partner\`) REFERENCES \`Partners\`(\`id_partner\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` ADD CONSTRAINT \`FK_5e94172c6086dc52ffcda3b1236\` FOREIGN KEY (\`id_type\`) REFERENCES \`BenefitTypes\`(\`id_type\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` ADD CONSTRAINT \`FK_6b12837b829dc6fed5b497dcae8\` FOREIGN KEY (\`id_user\`) REFERENCES \`Users\`(\`id_user\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` ADD CONSTRAINT \`FK_dd90256db2b710c434669594a31\` FOREIGN KEY (\`id_benefit\`) REFERENCES \`Benefits\`(\`id_benefit\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`PaymentMethods_Benefits\` ADD CONSTRAINT \`FK_7c725b86f1f2cb0256ce1d3f36e\` FOREIGN KEY (\`id_payment_method\`) REFERENCES \`PaymentMethods\`(\`id_payment_method\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`PaymentMethods_Benefits\` ADD CONSTRAINT \`FK_c4525e24654be41a18f16cee9d9\` FOREIGN KEY (\`id_benefit\`) REFERENCES \`Benefits\`(\`id_benefit\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Partners_Admins\` ADD CONSTRAINT \`FK_982f7cfb0f30395471a22b5bb53\` FOREIGN KEY (\`id_partner\`) REFERENCES \`Partners\`(\`id_partner\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Partners_Admins\` ADD CONSTRAINT \`FK_caf63610dab0cef3b75d87c04af\` FOREIGN KEY (\`id_user\`) REFERENCES \`Accounts\`(\`id_user\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Directions\` ADD CONSTRAINT \`FK_bd5cfbcad9f31d8f2e1830ad873\` FOREIGN KEY (\`id_partner\`) REFERENCES \`Partners\`(\`id_partner\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Directions\` DROP FOREIGN KEY \`FK_bd5cfbcad9f31d8f2e1830ad873\``);
        await queryRunner.query(`ALTER TABLE \`Partners_Admins\` DROP FOREIGN KEY \`FK_caf63610dab0cef3b75d87c04af\``);
        await queryRunner.query(`ALTER TABLE \`Partners_Admins\` DROP FOREIGN KEY \`FK_982f7cfb0f30395471a22b5bb53\``);
        await queryRunner.query(`ALTER TABLE \`PaymentMethods_Benefits\` DROP FOREIGN KEY \`FK_c4525e24654be41a18f16cee9d9\``);
        await queryRunner.query(`ALTER TABLE \`PaymentMethods_Benefits\` DROP FOREIGN KEY \`FK_7c725b86f1f2cb0256ce1d3f36e\``);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` DROP FOREIGN KEY \`FK_dd90256db2b710c434669594a31\``);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` DROP FOREIGN KEY \`FK_6b12837b829dc6fed5b497dcae8\``);
        await queryRunner.query(`ALTER TABLE \`Benefits\` DROP FOREIGN KEY \`FK_5e94172c6086dc52ffcda3b1236\``);
        await queryRunner.query(`ALTER TABLE \`Benefits\` DROP FOREIGN KEY \`FK_65a8f16542b510030db783acad9\``);
        await queryRunner.query(`ALTER TABLE \`Benefits\` DROP FOREIGN KEY \`FK_be1f417d247c4ed000122215073\``);
        await queryRunner.query(`ALTER TABLE \`Partners\` DROP FOREIGN KEY \`FK_4d9e114868b838c8a507e386acf\``);
        await queryRunner.query(`ALTER TABLE \`Partners_Categories\` DROP FOREIGN KEY \`FK_feb99400dd667ee0d4eb6918487\``);
        await queryRunner.query(`ALTER TABLE \`Partners_Categories\` DROP FOREIGN KEY \`FK_7e2fb3a7071b5ee263a93592190\``);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` DROP FOREIGN KEY \`FK_f85c169d27ed0e5a8e87434ff55\``);
        await queryRunner.query(`ALTER TABLE \`Accounts\` DROP FOREIGN KEY \`FK_ef4e45b5f5c3bc64d66142cbcbb\``);
        await queryRunner.query(`ALTER TABLE \`Partners\` DROP COLUMN \`direction\``);
        await queryRunner.query(`DROP TABLE \`Directions\``);
        await queryRunner.query(`DROP TABLE \`Partners_Admins\``);
        await queryRunner.query(`DROP TABLE \`PaymentMethods_Benefits\``);
        await queryRunner.query(`DROP TABLE \`PaymentMethods\``);
        await queryRunner.query(`DROP TABLE \`Vouchers\``);
        await queryRunner.query(`DROP INDEX \`IDX_5ad4aa48976a5fa65c352fb287\` ON \`Benefits\``);
        await queryRunner.query(`DROP INDEX \`IDX_6b0b4658559d4b81a0d54dadb4\` ON \`Benefits\``);
        await queryRunner.query(`DROP INDEX \`IDX_20cb92aacb351dc0b03e4000f3\` ON \`Benefits\``);
        await queryRunner.query(`DROP INDEX \`IDX_7e9400ee7b86f7a09c84d40d9a\` ON \`Benefits\``);
        await queryRunner.query(`DROP INDEX \`IDX_a16720258707094a7b428c97bb\` ON \`Benefits\``);
        await queryRunner.query(`DROP TABLE \`Benefits\``);
        await queryRunner.query(`DROP INDEX \`REL_4d9e114868b838c8a507e386ac\` ON \`Partners\``);
        await queryRunner.query(`DROP TABLE \`Partners\``);
        await queryRunner.query(`DROP TABLE \`Partners_Categories\``);
        await queryRunner.query(`DROP TABLE \`Categories\``);
        await queryRunner.query(`DROP TABLE \`BenefitTypes\``);
        await queryRunner.query(`DROP TABLE \`RefreshTokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_0c5666efc38b6f023b7814c73d\` ON \`Accounts\``);
        await queryRunner.query(`DROP INDEX \`IDX_0c9042702a3047d28d0a1e68d2\` ON \`Accounts\``);
        await queryRunner.query(`DROP INDEX \`IDX_0c5666efc38b6f023b7814c73d\` ON \`Accounts\``);
        await queryRunner.query(`DROP TABLE \`Accounts\``);
        await queryRunner.query(`DROP INDEX \`IDX_d9de24daa15c9441939de28998\` ON \`Users\``);
        await queryRunner.query(`DROP TABLE \`Users\``);
    }

}
