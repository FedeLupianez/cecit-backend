import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRefreshTokenEntity1779980134095 implements MigrationInterface {
  name = 'UpdateRefreshTokenEntity1779980134095';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`RefreshTokens\` ADD \`id_token\` varchar(36) NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`RefreshTokens\` ADD \`id_user\` varchar(4) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`RefreshTokens\` ADD UNIQUE INDEX \`IDX_8f0418755267553d7b974491c1\` (\`id_user\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Users\` CHANGE \`email\` \`email\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Users\` CHANGE \`password\` \`password\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Users\` CHANGE \`last_activity\` \`last_activity\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Vouchers\` CHANGE \`delivery_date\` \`delivery_date\` date NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_8f0418755267553d7b974491c1\` ON \`RefreshTokens\` (\`id_user\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`RefreshTokens\` ADD CONSTRAINT \`FK_8f0418755267553d7b974491c18\` FOREIGN KEY (\`id_user\`) REFERENCES \`Users\`(\`id_user\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`RefreshTokens\` DROP FOREIGN KEY \`FK_8f0418755267553d7b974491c18\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_8f0418755267553d7b974491c1\` ON \`RefreshTokens\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Vouchers\` CHANGE \`delivery_date\` \`delivery_date\` date NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Users\` CHANGE \`last_activity\` \`last_activity\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Users\` CHANGE \`password\` \`password\` varchar(255) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Users\` CHANGE \`email\` \`email\` varchar(50) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`RefreshTokens\` DROP INDEX \`IDX_8f0418755267553d7b974491c1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`RefreshTokens\` DROP COLUMN \`id_user\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`RefreshTokens\` DROP COLUMN \`id_token\``,
    );
  }
}
