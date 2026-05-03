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


}