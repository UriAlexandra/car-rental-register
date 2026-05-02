import { Controller } from "./base.controller";
import { AppDataSource } from "../data-source";
import { Rental } from "../entity/Rental";
import { Request, Response } from 'express';

export class RentalController extends Controller {
    repository = AppDataSource.getRepository(Rental);

    getAll = async (req: Request, res: Response): Promise<any> => {
        try {
            const rentals = await this.repository.find({
                relations: ['customer', 'items', 'items.vehicle']
            });
            res.json(rentals);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    getOne = async (req: Request, res: Response): Promise<any> => {
        try {
            const id = parseInt(req.params.id as string);

            const rental = await this.repository.findOne({
                where: { id },
                relations: ['customer', 'items', 'items.vehicle']
            });

            if (!rental) {
                return this.handleError(res, null, 404, 'No entity exists with the given id');
            }

            res.json(rental);
        } catch (err) {
            this.handleError(res, err);
        }
    };
}