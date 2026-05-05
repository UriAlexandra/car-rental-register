import { VehicleStatus } from "../../../models/enums";
import { AppDataSource } from "../data-source";
import { Rental } from "../entity/Rental";
import { Vehicle } from "../entity/Vehicle";
import { Controller } from "./base.controller";

export class RentalController extends Controller {
    repository = AppDataSource.getRepository(Rental);

    // --- GET OVERRIDES ---
    getAll = async (req, res) => {
        try {
            const entities = await this.repository.find({
                relations: ['customer', 'vehicle']
            });
            res.json(entities);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    create = async (req, res) => {
        try {
            const { customer, vehicle, startDate } = req.body;

            const vehicleRepo = AppDataSource.getRepository(Vehicle);
            const targetVehicle = await vehicleRepo.findOneBy({ id: vehicle });

            if (!targetVehicle) return this.handleError(res, null, 404, 'Jármű nem található.');
            if (targetVehicle.status !== VehicleStatus.Free) {
                return this.handleError(res, null, 400, 'Ez a jármű jelenleg nem szabad!');
            }

            targetVehicle.status = VehicleStatus.Rented;
            await vehicleRepo.save(targetVehicle);

            const entityToCreate = this.repository.create({
                customer: { id: customer },
                vehicle: targetVehicle,
                startDate: startDate || new Date(),
                endDate: null,
                totalFee: null
            } as any);
            const entitySaved = await this.repository.save(entityToCreate);

            res.json(entitySaved);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    closeRental = async (req, res) => {
        try {
            const rentalId = req.params['id'];
            const { endDate, drivenKm, isDamaged } = req.body;
            const rental = await this.repository.findOne({
                where: { id: rentalId },
                relations: ['vehicle']
            });

            if (!rental) return this.handleError(res, null, 404, 'Kölcsönzés nem található.');
            if (rental.endDate) return this.handleError(res, null, 400, 'Ezt a kölcsönzést már lezárták!');

            const vehicle = rental.vehicle;
            const start = new Date(rental.startDate);
            const end = new Date(endDate);

            const diffTime = Math.abs(end.getTime() - start.getTime());
            let rentedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (rentedDays === 0) rentedDays = 1; // Minimum 1 napot ki kell fizetni

            const FIXED_DAMAGE_PENALTY = 50000;
            const damagePenaltyToApply = isDamaged ? FIXED_DAMAGE_PENALTY : 0;

            const calculatedFee = (rentedDays * vehicle.dailyFee)
                                + (drivenKm * vehicle.kmFee)
                                + damagePenaltyToApply;

            rental.endDate = end;
            rental.drivenKm = drivenKm;
            rental.damageFee = damagePenaltyToApply;
            rental.totalFee = calculatedFee;
            await this.repository.save(rental);

            const vehicleRepo = AppDataSource.getRepository(Vehicle);
            vehicle.status = VehicleStatus.Free;
            await vehicleRepo.save(vehicle);

            res.json(rental);
        } catch (err) {
            this.handleError(res, err);
        }
    };
}
