import "reflect-metadata"
import { DataSource } from 'typeorm';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [],
    providers: [
        {
            provide: DataSource, // add the datasource as a provider
            inject: [ConfigService],
            useFactory: async (config_service: ConfigService) => {
                try {
                    const dataSource = new DataSource({
                        type: "mysql",
                        host: config_service.get<string>('DB_HOST'),
                        port: config_service.get<number>('DB_PORT'),
                        username: config_service.get<string>('DB_USER'),
                        password: config_service.get<string>('DB_PASSWORD'),
                        database: config_service.get<string>('DB_NAME'),
                        entities: [`${__dirname}/../**/**.entity{.ts,.js}`], // Carga las entidades de src
                        migrations: ["src/migration/**/*.ts"]
                    });
                    await dataSource.initialize();
                    console.log('Database connected successfully');
                    return dataSource;
                } catch (error) {
                    console.log('Error connecting to database');
                    throw error;
                }
            },
        },
    ],
    exports: [DataSource],
})
export class TypeOrmModule { }
