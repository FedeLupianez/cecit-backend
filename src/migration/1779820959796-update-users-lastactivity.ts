import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsersLastactivity1779820959796 implements MigrationInterface {
    name = 'UpdateUsersLastactivity1779820959796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`email\` \`email\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`password\` \`password\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`last_activity\``);
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`last_activity\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`last_activity\``);
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`last_activity\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`password\` \`password\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`email\` \`email\` varchar(50) NULL DEFAULT 'NULL'`);
    }

}
