import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokens1778607224253 implements MigrationInterface {
    name = 'AddRefreshTokens1778607224253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`RefreshTokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token_hash\` varchar(64) NOT NULL, \`user_id\` varchar(4) NOT NULL, \`expires_at\` datetime NOT NULL, \`revoked\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_token_hash\` (\`token_hash\`), INDEX \`IDX_user_id\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_user_id\` ON \`RefreshTokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_token_hash\` ON \`RefreshTokens\``);
        await queryRunner.query(`DROP TABLE \`RefreshTokens\``);
    }

}
