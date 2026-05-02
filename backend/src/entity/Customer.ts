import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Rental } from './Rental';

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    address!: string;

    @Column()
    idCardNumber!: string;

    @Column()
    phone!: string;

    @Column()
    email: string;

    @OneToMany(() => Rental, (rental) => rental.customer)
    rentals!: Rental[];

    @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
    createdAt: Date;
}