import express from 'express';
import { CustomerController } from './controller/customer.controller';
import { VehicleController } from './controller/vehicle.controller';
import { RentalController } from './controller/rental.controller';

export const appRouter = express.Router();

const vehicleController = new VehicleController();
appRouter.get('/vehicle', vehicleController.getAll);
appRouter.get('/vehicle/:id', vehicleController.getOne);
appRouter.post('/vehicle', vehicleController.create);
appRouter.put('/vehicle', vehicleController.update);
appRouter.delete('/vehicle/:id', vehicleController.delete);

const customerController = new CustomerController();
appRouter.get('/customer', customerController.getAll);
appRouter.get('/customer/:id', customerController.getOne);
appRouter.post('/customer', customerController.create);
appRouter.put('/customer', customerController.update);
appRouter.delete('/customer/:id', customerController.delete);

const rentalController = new RentalController();
appRouter.get('/rental', rentalController.getAll);
appRouter.get('/rental/:id', rentalController.getOne);
appRouter.post('/rental', rentalController.create);
appRouter.put('/rental/:id/close', rentalController.closeRental);
appRouter.delete('/rental/:id', rentalController.delete);
