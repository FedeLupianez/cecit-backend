import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config({
    path: '.env.development',
});

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    entities: [__dirname + "/../**/*.entity{.ts,.js}"],

    migrations: [__dirname + "/../migration/*{.ts,.js}"],

    synchronize: false,
});
