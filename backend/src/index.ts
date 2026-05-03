import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import { appRouter } from "./routes";

async function main() {
    await AppDataSource.initialize();
    const app = express();

    app.use(express.json());
    app.use('/api', appRouter);

    app.listen(3000, (err) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log('Server: OK');
    });
}

main().catch(err => console.error(err));
