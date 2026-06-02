import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { config } from 'dotenv';
import { resolve } from "path";

const envFile = '.env.development'

config({ path: resolve(__dirname, envFile) });

export const dataSourceOptions: DataSourceOptions = {
    type: "mariadb",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3307,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    entities: [__dirname + "/**/*.entity{.ts,.js}"],

    migrations: [__dirname + "/migration/*{.ts,.js}"],

    synchronize: false,
}

export const AppDataSource = new DataSource(dataSourceOptions);
