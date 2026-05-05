import { AppDataSource } from "../data-source";
import { Customer } from "../entity/Customer";
import { Controller } from "./base.controller";

export class CustomerController extends Controller {
    repository = AppDataSource.getRepository(Customer);

    getAll = async (req, res) => {
        try {
            const entities = await this.repository.find({
                relations: ['rentals', 'rentals.vehicle']
            });
            res.json(entities);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    getOne = async (req, res) => {
        try {
            const id = req.params['id'];
            const entity = await this.repository.findOne({
                where: { id: id },
                relations: ['rentals', 'rentals.vehicle']
            });
            if (!entity) return this.handleError(res, null, 404, 'Ügyfél nem található.');
            res.json(entity);
        } catch (err) {
            this.handleError(res, err);
        }
    };
}
