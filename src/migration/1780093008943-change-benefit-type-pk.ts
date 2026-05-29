import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeBenefitTypePk1780093008943 implements MigrationInterface {
    name = 'ChangeBenefitTypePk1780093008943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_be1f417d247c4ed00012221507\` ON \`Benefits\``);
        await queryRunner.query(`DROP INDEX \`IDX_65a8f16542b510030db783acad\` ON \`Benefits\``);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` CHANGE \`delivery_date\` \`delibery_date\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` DROP COLUMN \`id_token\``);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` ADD \`id_token\` uuid NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` CHANGE \`status\` \`status\` enum ('PENDING', 'DELIVERED', 'EXPIRED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` DROP FOREIGN KEY \`FK_5e94172c6086dc52ffcda3b1236\``);
        await queryRunner.query(`ALTER TABLE \`Benefit_Type\` CHANGE \`id_type\` \`id_type\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Benefit_Type\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`Benefit_Type\` DROP COLUMN \`id_type\``);
        await queryRunner.query(`ALTER TABLE \`Benefit_Type\` ADD \`id_type\` varchar(4) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` DROP COLUMN \`id_type\``);
        await queryRunner.query(`ALTER TABLE \`Benefits\` ADD \`id_type\` varchar(4) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` CHANGE \`status\` \`status\` enum ('PENDING', 'DELIVERED', 'EXPIRED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`CREATE INDEX \`IDX_be1f417d247c4ed00012221507\` ON \`Benefits\` (\`id_admin\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_65a8f16542b510030db783acad\` ON \`Benefits\` (\`id_partner\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_5e94172c6086dc52ffcda3b123\` ON \`Benefits\` (\`id_type\`)`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` ADD CONSTRAINT \`FK_5e94172c6086dc52ffcda3b1236\` FOREIGN KEY (\`id_type\`) REFERENCES \`Benefit_Type\`(\`id_type\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Benefits\` DROP FOREIGN KEY \`FK_5e94172c6086dc52ffcda3b1236\``);
        await queryRunner.query(`DROP INDEX \`IDX_5e94172c6086dc52ffcda3b123\` ON \`Benefits\``);
        await queryRunner.query(`DROP INDEX \`IDX_65a8f16542b510030db783acad\` ON \`Benefits\``);
        await queryRunner.query(`DROP INDEX \`IDX_be1f417d247c4ed00012221507\` ON \`Benefits\``);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` CHANGE \`status\` \`status\` enum ('PENDING', 'DELIVERED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` DROP COLUMN \`id_type\``);
        await queryRunner.query(`ALTER TABLE \`Benefits\` ADD \`id_type\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Benefit_Type\` DROP COLUMN \`id_type\``);
        await queryRunner.query(`ALTER TABLE \`Benefit_Type\` ADD \`id_type\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`Benefit_Type\` ADD PRIMARY KEY (\`id_type\`)`);
        await queryRunner.query(`ALTER TABLE \`Benefit_Type\` CHANGE \`id_type\` \`id_type\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` ADD CONSTRAINT \`FK_5e94172c6086dc52ffcda3b1236\` FOREIGN KEY (\`id_type\`) REFERENCES \`Benefit_Type\`(\`id_type\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` CHANGE \`status\` \`status\` enum ('PENDING', 'DELIVERED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` DROP COLUMN \`id_token\``);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` ADD \`id_token\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` ADD PRIMARY KEY (\`id_token\`)`);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` CHANGE \`delibery_date\` \`delivery_date\` date NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_65a8f16542b510030db783acad\` ON \`Benefits\` (\`id_partner\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_be1f417d247c4ed00012221507\` ON \`Benefits\` (\`id_admin\`)`);
    }

}
