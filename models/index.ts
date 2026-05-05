import { VehicleStatus, VehicleType } from "./enums";

export interface CustomerDTO {
    id: number;
    name: string;
    address: string;
    idCardNumber: string;
    phoneNumber: string;
    rentals: RentalDTO[];
}

export interface VehicleDTO {
    id: number;
    type: VehicleType;
    manufacturer: string;
    licensePlate: string;
    chassisNumber: string;
    purchaseDate: Date;
    serialNumber: string;
    dailyFee: number;
    kmFee: number;
    status: VehicleStatus;
}

export interface RentalDTO {
    id: number;
    customer: CustomerDTO;
    vehicle: VehicleDTO;
    startDate: Date;
    endDate: Date | null;
    drivenKm: number | null;
    damageFee: number | null;
    totalFee: number | null;
}
