import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { UsersEntity } from "../entities/users/users.entity";

dotenv.config({
    path: '.env.development',
});

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3307,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    entities: [UsersEntity],

    migrations: [__dirname + "/../migration/*{.ts,.js}"],

    synchronize: false,
});
