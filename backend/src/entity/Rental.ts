import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Customer } from './Customer';
import { RentalItem } from './RentalItem';

@Entity('rental')
export class Rental {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Customer, (customer) => customer.rentals, { nullable: false })
    @JoinColumn({ name: 'customer_id' })
    customer!: Customer;

    @Column({ name: 'rentalDate', type: 'datetime' })
    rentalDate!: Date;

    @Column({ type: 'text', nullable: true })
    notes!: string;

    // A cascade: true miatt, ha mentesz egy új Rental-t a hozzá tartozó itemekkel, 
    // a TypeORM automatikusan elmenti az itemeket is.
    @OneToMany(() => RentalItem, (rentalItem) => rentalItem.rental, { cascade: true })
    items!: RentalItem[];
}