import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Rental } from './Rental';
import { Vehicle } from './Vehicle';
import { RentalItemStatus } from '../../../models/enums';

@Entity('rental_item')
export class RentalItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Rental, (rental) => rental.items, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'rental_id' })
    rental!: Rental;

    @ManyToOne(() => Vehicle, (vehicle) => vehicle.rentalItems, { nullable: false })
    @JoinColumn({ name: 'vehicle_id' })
    vehicle!: Vehicle;

    @Column({ name: 'start_km', type: 'int' })
    startKm!: number;

    @Column({ name: 'end_km', type: 'int', nullable: true })
    endKm!: number;

    @Column({ name: 'is_damaged', type: 'boolean', default: false })
    isDamaged!: boolean;

    @Column({ name: 'return_date', type: 'datetime', nullable: true })
    returnDate!: Date;

    @Column({ name: 'total_fee', type: 'decimal', precision: 10, scale: 2, nullable: true })
    totalFee!: number;

    @Column({ type: 'enum', enum: RentalItemStatus, default: RentalItemStatus.ACTIVE })
    status!: RentalItemStatus;
}