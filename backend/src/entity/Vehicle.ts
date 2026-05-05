import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { VehicleDTO } from "../../../models";
import { VehicleStatus, VehicleType } from "../../../models/enums";
import { Rental } from "./Rental";

@Entity()
export class Vehicle implements VehicleDTO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: VehicleType })
    type: VehicleType;

    @Column()
    manufacturer: string;

    @Column()
    licensePlate: string;

    @Column()
    chassisNumber: string;

    @Column({ type: 'date' })
    purchaseDate: Date;

    @Column()
    serialNumber: string;

    @Column({ type: 'int' })
    dailyFee: number;

    @Column({ type: 'int' })
    kmFee: number;

    @Column({ type: 'enum', enum: VehicleStatus, default: VehicleStatus.Free })
    status: VehicleStatus;

    @OneToMany(() => Rental, rental => rental.vehicle)
    rentals: Rental[];
}
