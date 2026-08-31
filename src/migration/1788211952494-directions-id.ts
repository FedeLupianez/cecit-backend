import { MigrationInterface, QueryRunner } from 'typeorm';

export class DirectionsId1788211952494 implements MigrationInterface {
    name = 'DirectionsId1788211952494';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`Directions\` DROP PRIMARY KEY`,
        );
        await queryRunner.query(
            `ALTER TABLE \`Directions\` ADD \`id\` int NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (\`id\`)`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`Directions\` DROP PRIMARY KEY`,
        );
        await queryRunner.query(
            `ALTER TABLE \`Directions\` DROP COLUMN \`id\`, ADD PRIMARY KEY (\`id_partner\`)`,
        );
    }
}
