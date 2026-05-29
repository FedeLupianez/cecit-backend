import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778607224252 implements MigrationInterface {
    name = 'Init1778607224252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Users\` (\`id_user\` varchar(4) NOT NULL, \`email\` varchar(50) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(50) NOT NULL, \`lastname\` varchar(50) NOT NULL, \`dni\` varchar(8) NOT NULL, \`last_activity\` date NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, INDEX \`IDX_3c3ab3f49a87e6ddb607f3c494\` (\`email\`), INDEX \`IDX_d9de24daa15c9441939de28998\` (\`dni\`), PRIMARY KEY (\`id_user\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`CecitAdmins\` (\`id_c_admin\` varchar(4) NOT NULL, \`email\` varchar(50) NOT NULL, \`password\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL, INDEX \`IDX_e299ff4af308cc151428c8f1f9\` (\`email\`), PRIMARY KEY (\`id_c_admin\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Benefit_Type\` (\`id_type\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id_type\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Partners\` (\`id_partner\` varchar(4) NOT NULL, \`name\` varchar(50) NOT NULL, \`logo\` varchar(255) NOT NULL, \`direction\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id_partner\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Benefits\` (\`id_benefit\` varchar(4) NOT NULL, \`id_admin\` varchar(4) NOT NULL, \`id_partner\` varchar(4) NOT NULL, \`date_entered\` date NOT NULL, \`start_date\` date NOT NULL, \`end_date\` date NOT NULL, \`image\` varchar(100) NOT NULL, \`title\` varchar(100) NOT NULL, \`description\` varchar(500) NOT NULL, \`status\` enum ('ACTIVE', 'INACTIVE', 'PENDING') NOT NULL DEFAULT 'ACTIVE', \`id_type\` int NOT NULL, \`coupons\` int NOT NULL, INDEX \`IDX_be1f417d247c4ed00012221507\` (\`id_admin\`), INDEX \`IDX_65a8f16542b510030db783acad\` (\`id_partner\`), PRIMARY KEY (\`id_benefit\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Vouchers\` (\`token\` varchar(6) NOT NULL, \`id_user\` varchar(4) NOT NULL, \`id_benefit\` varchar(4) NOT NULL, \`application_date\` date NOT NULL, \`delivery_date\` date NULL, \`status\` enum ('PENDING', 'DELIVERED') NOT NULL DEFAULT 'PENDING', INDEX \`IDX_6b12837b829dc6fed5b497dcae\` (\`id_user\`), INDEX \`IDX_dd90256db2b710c434669594a3\` (\`id_benefit\`), PRIMARY KEY (\`token\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`PaymentMethods\` (\`id_payment_method\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id_payment_method\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Payment_Benefit\` (\`id_payment_method\` int NOT NULL, \`id_benefit\` varchar(4) NOT NULL, PRIMARY KEY (\`id_payment_method\`, \`id_benefit\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`PartnersAdmins\` (\`id_p_admin\` varchar(4) NOT NULL, \`id_partner\` varchar(4) NOT NULL, \`email\` varchar(50) NOT NULL, \`password\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL, INDEX \`IDX_dc285106d5fcee21e1338908db\` (\`id_partner\`), INDEX \`IDX_0b8f480670054ae857102df211\` (\`email\`), PRIMARY KEY (\`id_p_admin\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Categories\` (\`id_category\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id_category\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Partners_Categories\` (\`id_partner\` varchar(4) NOT NULL, \`id_category\` int NOT NULL, PRIMARY KEY (\`id_partner\`, \`id_category\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` ADD CONSTRAINT \`FK_be1f417d247c4ed000122215073\` FOREIGN KEY (\`id_admin\`) REFERENCES \`CecitAdmins\`(\`id_c_admin\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` ADD CONSTRAINT \`FK_65a8f16542b510030db783acad9\` FOREIGN KEY (\`id_partner\`) REFERENCES \`Partners\`(\`id_partner\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` ADD CONSTRAINT \`FK_5e94172c6086dc52ffcda3b1236\` FOREIGN KEY (\`id_type\`) REFERENCES \`Benefit_Type\`(\`id_type\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` ADD CONSTRAINT \`FK_6b12837b829dc6fed5b497dcae8\` FOREIGN KEY (\`id_user\`) REFERENCES \`Users\`(\`id_user\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` ADD CONSTRAINT \`FK_dd90256db2b710c434669594a31\` FOREIGN KEY (\`id_benefit\`) REFERENCES \`Benefits\`(\`id_benefit\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Payment_Benefit\` ADD CONSTRAINT \`FK_1020856c55a0eabf5757f6f60b0\` FOREIGN KEY (\`id_payment_method\`) REFERENCES \`PaymentMethods\`(\`id_payment_method\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Payment_Benefit\` ADD CONSTRAINT \`FK_fde159496e03a8c7dc3501b22f3\` FOREIGN KEY (\`id_benefit\`) REFERENCES \`Benefits\`(\`id_benefit\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`PartnersAdmins\` ADD CONSTRAINT \`FK_dc285106d5fcee21e1338908db1\` FOREIGN KEY (\`id_partner\`) REFERENCES \`Partners\`(\`id_partner\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Partners_Categories\` ADD CONSTRAINT \`FK_7e2fb3a7071b5ee263a93592190\` FOREIGN KEY (\`id_partner\`) REFERENCES \`Partners\`(\`id_partner\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Partners_Categories\` ADD CONSTRAINT \`FK_feb99400dd667ee0d4eb6918487\` FOREIGN KEY (\`id_category\`) REFERENCES \`Categories\`(\`id_category\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Partners_Categories\` DROP FOREIGN KEY \`FK_feb99400dd667ee0d4eb6918487\``);
        await queryRunner.query(`ALTER TABLE \`Partners_Categories\` DROP FOREIGN KEY \`FK_7e2fb3a7071b5ee263a93592190\``);
        await queryRunner.query(`ALTER TABLE \`PartnersAdmins\` DROP FOREIGN KEY \`FK_dc285106d5fcee21e1338908db1\``);
        await queryRunner.query(`ALTER TABLE \`Payment_Benefit\` DROP FOREIGN KEY \`FK_fde159496e03a8c7dc3501b22f3\``);
        await queryRunner.query(`ALTER TABLE \`Payment_Benefit\` DROP FOREIGN KEY \`FK_1020856c55a0eabf5757f6f60b0\``);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` DROP FOREIGN KEY \`FK_dd90256db2b710c434669594a31\``);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` DROP FOREIGN KEY \`FK_6b12837b829dc6fed5b497dcae8\``);
        await queryRunner.query(`ALTER TABLE \`Benefits\` DROP FOREIGN KEY \`FK_5e94172c6086dc52ffcda3b1236\``);
        await queryRunner.query(`ALTER TABLE \`Benefits\` DROP FOREIGN KEY \`FK_65a8f16542b510030db783acad9\``);
        await queryRunner.query(`ALTER TABLE \`Benefits\` DROP FOREIGN KEY \`FK_be1f417d247c4ed000122215073\``);
        await queryRunner.query(`DROP TABLE \`Partners_Categories\``);
        await queryRunner.query(`DROP TABLE \`Categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_0b8f480670054ae857102df211\` ON \`PartnersAdmins\``);
        await queryRunner.query(`DROP INDEX \`IDX_dc285106d5fcee21e1338908db\` ON \`PartnersAdmins\``);
        await queryRunner.query(`DROP TABLE \`PartnersAdmins\``);
        await queryRunner.query(`DROP TABLE \`Payment_Benefit\``);
        await queryRunner.query(`DROP TABLE \`PaymentMethods\``);
        await queryRunner.query(`DROP INDEX \`IDX_dd90256db2b710c434669594a3\` ON \`Vouchers\``);
        await queryRunner.query(`DROP INDEX \`IDX_6b12837b829dc6fed5b497dcae\` ON \`Vouchers\``);
        await queryRunner.query(`DROP TABLE \`Vouchers\``);
        await queryRunner.query(`DROP INDEX \`IDX_65a8f16542b510030db783acad\` ON \`Benefits\``);
        await queryRunner.query(`DROP INDEX \`IDX_be1f417d247c4ed00012221507\` ON \`Benefits\``);
        await queryRunner.query(`DROP TABLE \`Benefits\``);
        await queryRunner.query(`DROP TABLE \`Partners\``);
        await queryRunner.query(`DROP TABLE \`Benefit_Type\``);
        await queryRunner.query(`DROP INDEX \`IDX_e299ff4af308cc151428c8f1f9\` ON \`CecitAdmins\``);
        await queryRunner.query(`DROP TABLE \`CecitAdmins\``);
        await queryRunner.query(`DROP INDEX \`IDX_d9de24daa15c9441939de28998\` ON \`Users\``);
        await queryRunner.query(`DROP INDEX \`IDX_3c3ab3f49a87e6ddb607f3c494\` ON \`Users\``);
        await queryRunner.query(`DROP TABLE \`Users\``);
    }

}
