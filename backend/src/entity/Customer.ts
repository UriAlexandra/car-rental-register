import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CustomerDTO } from "../../../models";
import { Rental } from "./Rental";

@Entity()
export class Customer implements CustomerDTO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column({ unique: true })
    idCardNumber: string;

    @Column()
    phoneNumber: string;

    @OneToMany(() => Rental, rental => rental.customer)
    rentals: Rental[];
}
