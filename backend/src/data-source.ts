import { DataSource } from "typeorm";
import { Customer } from "./entity/Customer";
import { Vehicle } from "./entity/Vehicle";
import { Rental } from "./entity/Rental";
import { RentalItem } from "./entity/RentalItem";


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    //password: "test",
    database: "car_rental",
    synchronize: true,
    logging: true,
    entities: [Customer, Vehicle, Rental, RentalItem],
    subscribers: [],
    migrations: [],
});