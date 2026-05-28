import { MigrationInterface, QueryRunner } from "typeorm";

export class NombreMigration1779820683700 implements MigrationInterface {
    name = 'NombreMigration1779820683700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`email\` \`email\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`password\` \`password\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`password\` \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`email\` \`email\` varchar(50) NOT NULL`);
    }

}
