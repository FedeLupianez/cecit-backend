import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUrlColumnCategory1779889415053 implements MigrationInterface {
    name = 'AddUrlColumnCategory1779889415053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_token_hash\` ON \`RefreshTokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_user_id\` ON \`RefreshTokens\``);
        await queryRunner.query(`ALTER TABLE \`Categories\` ADD \`icon_url\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`email\` \`email\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`password\` \`password\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`last_activity\` \`last_activity\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` CHANGE \`delivery_date\` \`delivery_date\` date NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_a8902d4754e89411bbc04a9774\` ON \`RefreshTokens\` (\`token_hash\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_0205f7cffb3c88fcfd1c601454\` ON \`RefreshTokens\` (\`user_id\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_0205f7cffb3c88fcfd1c601454\` ON \`RefreshTokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_a8902d4754e89411bbc04a9774\` ON \`RefreshTokens\``);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` CHANGE \`delivery_date\` \`delivery_date\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`last_activity\` \`last_activity\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`password\` \`password\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`email\` \`email\` varchar(50) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`Categories\` DROP COLUMN \`icon_url\``);
        await queryRunner.query(`CREATE INDEX \`IDX_user_id\` ON \`RefreshTokens\` (\`user_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_token_hash\` ON \`RefreshTokens\` (\`token_hash\`)`);
    }

}
