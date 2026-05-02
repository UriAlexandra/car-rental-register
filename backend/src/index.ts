import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import { Customer } from "./entity/Customer";

async function main() {
    await AppDataSource.initialize();

    const customer = new Customer();
    customer.name = 'Kovács Géza';

    const repository = AppDataSource.getRepository(Customer);
    await repository.save(customer);

    console.log('Database: OK');

    const app = express();
    app.listen(3000, (err) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log('Server: OK');
    });
}

main().catch(err => console.error(err));
