import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMaxColumnBenefits1779974408035 implements MigrationInterface {
    name = 'AddMaxColumnBenefits1779974408035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Benefits\` ADD \`max_cupouns\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`email\` \`email\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`password\` \`password\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`last_activity\` \`last_activity\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`Vouchers\` CHANGE \`delivery_date\` \`delivery_date\` date NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Vouchers\` CHANGE \`delivery_date\` \`delivery_date\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`last_activity\` \`last_activity\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`password\` \`password\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`email\` \`email\` varchar(50) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` DROP COLUMN \`max_cupouns\``);
    }

}
