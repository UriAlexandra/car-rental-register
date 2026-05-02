import { Controller } from "./base.controller";
import { AppDataSource } from "../data-source";
import { Customer } from "../entity/Customer";
import { Request, Response } from 'express';

export class CustomerController extends Controller {
    repository = AppDataSource.getRepository(Customer);

    getAll = async (req: Request, res: Response): Promise<any> => {
        try {
            const customers = await this.repository.find({
                relations: ['rentals', 'rentals.items', 'rentals.items.vehicle']
            });
            res.json(customers);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    getOne = async (req: Request, res: Response): Promise<any> => {
        try {
            const id = parseInt(req.params.id as string);

            const customer = await this.repository.findOne({
                where: { id },
                relations: ['rentals', 'rentals.items', 'rentals.items.vehicle']
            });

            if (!customer) {
                return this.handleError(res, null, 404, 'No entity exists with the given id');
            }

            res.json(customer);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    handleError(res: Response, err: any = null, status = 500, message = 'Unknown server error') {
        if (err) console.error(err);

        if (err?.code === 'ER_DUP_ENTRY' || err?.errno === 1062) {
            return res.status(400).json({
                error: 'A megadott igazolványszám (vagy email) már létezik a rendszerben.'
            });
        }

        return super.handleError(res, err, status, message);
    };
}