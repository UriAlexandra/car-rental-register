import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RentalItem } from './RentalItem';
import { VehicleType, VehicleStatus } from '../../../models/enums';

@Entity('vehicle')
export class Vehicle {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'vehicle_type', type: 'enum', enum: VehicleType })
    vehicleType!: VehicleType;

    @Column()
    manufacturer!: string;

    @Column()
    model!: string;

    @Column({ name: 'license_plate', unique: true, nullable: true })
    licensePlate!: string;

    @Column({ name: 'chassis_number', unique: true })
    chassisNumber!: string;

    @Column({ name: 'purchase_date', type: 'date' })
    purchaseDate!: Date;

    @Column({ name: 'serial_number'})
    serialNumber!: string;

    @Column({ name: 'daily_rate', type: 'decimal', precision: 10, scale: 2 })
    dailyRate!: number;

    @Column({ name: 'km_rate', type: 'decimal', precision: 10, scale: 2 })
    kmRate!: number;

    @Column({ name: 'damage_fee', type: 'decimal', precision: 10, scale: 2 })
    damageFee!: number;

    @Column({ type: 'enum', enum: VehicleStatus, default: VehicleStatus.FREE })
    status!: VehicleStatus;

    @OneToMany(() => RentalItem, (rentalItem) => rentalItem.vehicle)
    rentalItems!: RentalItem[];
}