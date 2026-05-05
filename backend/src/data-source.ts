import { DataSource } from "typeorm";
import { Customer } from "./entity/Customer";
import { Rental } from "./entity/Rental";
import { Vehicle } from "./entity/Vehicle";


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    //password: "test",
    database: "car_rental",
    synchronize: true,
    logging: true,
    entities: [Customer, Rental, Vehicle],
    subscribers: [],
    migrations: [],
});
