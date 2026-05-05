import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RentalDTO } from "../../../models";
import { Vehicle } from "./Vehicle";
import { Customer } from "./Customer";

@Entity()
export class Rental implements RentalDTO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date', nullable: true })
    endDate: Date;

    @Column({ type: 'int', nullable: true })
    drivenKm: number;

    @Column({ type: 'int', nullable: true, default: 0 })
    damageFee: number;

    @Column({ type: 'int', nullable: true })
    totalFee: number;

    @ManyToOne(() => Customer, customer => customer.rentals, { onDelete: 'CASCADE' })
    customer: Customer;

    @ManyToOne(() => Vehicle, vehicle => vehicle.rentals, { onDelete: 'CASCADE' })
    vehicle: Vehicle;
}
