import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRefreshTokenUuid1780000727160 implements MigrationInterface {
    name = 'UpdateRefreshTokenUuid1780000727160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`RefreshTokens\` (\`id_token\` varchar(36) NOT NULL, \`token_hash\` varchar(255) NOT NULL, \`expires_at\` datetime NOT NULL, \`revoked\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`id_user\` varchar(4) NULL, PRIMARY KEY (\`id_token\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`email\` \`email\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`password\` \`password\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`last_activity\` \`last_activity\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` CHANGE \`delivery_date\` \`delivery_date\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` ADD CONSTRAINT \`FK_8f0418755267553d7b974491c18\` FOREIGN KEY (\`id_user\`) REFERENCES \`Users\`(\`id_user\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` DROP FOREIGN KEY \`FK_8f0418755267553d7b974491c18\``);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` CHANGE \`delivery_date\` \`delivery_date\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`last_activity\` \`last_activity\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`password\` \`password\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`email\` \`email\` varchar(50) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP TABLE \`RefreshTokens\``);
    }

}
