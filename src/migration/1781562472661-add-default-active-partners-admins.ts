import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultActivePartnersAdmins1781562472661 implements MigrationInterface {
    name = 'AddDefaultActivePartnersAdmins1781562472661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_be1f417d247c4ed00012221507\` ON \`Benefits\``);
        await queryRunner.query(`DROP INDEX \`IDX_65a8f16542b510030db783acad\` ON \`Benefits\``);
        await queryRunner.query(`DROP INDEX \`IDX_6b12837b829dc6fed5b497dcae\` ON \`Vouchers\``);
        await queryRunner.query(`DROP INDEX \`IDX_dd90256db2b710c434669594a3\` ON \`Vouchers\``);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` DROP COLUMN \`id_token\``);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` ADD \`id_token\` uuid NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`CecitAdmins\` CHANGE \`active\` \`active\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` CHANGE \`date_entered\` \`date_entered\` date NOT NULL DEFAULT CURRENT_DATE`);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` CHANGE \`status\` \`status\` enum ('PENDING', 'DELIVERED', 'EXPIRED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`PartnersAdmins\` CHANGE \`active\` \`active\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`CecitAdmins\` CHANGE \`active\` \`active\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` CHANGE \`date_entered\` \`date_entered\` date NOT NULL DEFAULT CURRENT_DATE`);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` CHANGE \`status\` \`status\` enum ('PENDING', 'DELIVERED', 'EXPIRED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`CREATE INDEX \`IDX_a8902d4754e89411bbc04a9774\` ON \`RefreshTokens\` (\`token_hash\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_a8902d4754e89411bbc04a9774\` ON \`RefreshTokens\``);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` CHANGE \`status\` \`status\` enum ('PENDING', 'DELIVERED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` CHANGE \`date_entered\` \`date_entered\` date NULL DEFAULT curdate()`);
        await queryRunner.query(`ALTER TABLE \`CecitAdmins\` CHANGE \`active\` \`active\` tinyint(1) NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`PartnersAdmins\` CHANGE \`active\` \`active\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` CHANGE \`status\` \`status\` enum ('PENDING', 'DELIVERED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` CHANGE \`date_entered\` \`date_entered\` date NULL DEFAULT curdate()`);
        await queryRunner.query(`ALTER TABLE \`CecitAdmins\` CHANGE \`active\` \`active\` tinyint(1) NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` DROP COLUMN \`id_token\``);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` ADD \`id_token\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` ADD PRIMARY KEY (\`id_token\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_dd90256db2b710c434669594a3\` ON \`Vouchers\` (\`id_benefit\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_6b12837b829dc6fed5b497dcae\` ON \`Vouchers\` (\`id_user\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_65a8f16542b510030db783acad\` ON \`Benefits\` (\`id_partner\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_be1f417d247c4ed00012221507\` ON \`Benefits\` (\`id_admin\`)`);
    }

}
