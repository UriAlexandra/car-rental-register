import { Controller } from "./base.controller";
import { AppDataSource } from "../data-source";
import { Vehicle } from "../entity/Vehicle";
import { Request, Response } from 'express';

export class VehicleController extends Controller {
    repository = AppDataSource.getRepository(Vehicle);

    // Hibakezelés felülírása a rendszám/alvázszám ütközések miatt
    handleError(res: Response, err: any = null, status = 500, message = 'Unknown server error') {
        if (err) console.error(err);

        if (err?.code === 'ER_DUP_ENTRY' || err?.errno === 1062) {
            return res.status(400).json({
                error: 'The specified license plate or chassis number is already registered!'
            });
        }

        return super.handleError(res, err, status, message);
    };
}