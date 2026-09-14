import { MigrationInterface, QueryRunner } from "typeorm";

export class BenefitsDatetime1788300000000 implements MigrationInterface {
    name = 'BenefitsDatetime1788300000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Benefits\` CHANGE \`start_date\` \`start_date\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` CHANGE \`end_date\` \`end_date\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Benefits\` CHANGE \`start_date\` \`start_date\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Benefits\` CHANGE \`end_date\` \`end_date\` date NOT NULL`);
    }
}
