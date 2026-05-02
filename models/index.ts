import { VehicleType, VehicleStatus, RentalItemStatus } from './enums';

export interface CustomerDTO {
    id: number;
    name: string;
    address: string;
    idCardNumber: string;
    phone: string;
    email?: string;
    createdAt?: string; 
}

export interface VehicleDTO {
    id: number;
    vehicleType: VehicleType;
    manufacturer: string;
    model: string;
    licensePlate?: string | null;
    chassisNumber: string;
    purchaseDate: string;
    serialNumber: string;
    dailyRate: number;
    kmRate: number;
    damageFee: number;
    status: VehicleStatus;
}

export interface RentalItemDTO {
    id: number;
    rentalId?: number; 
    vehicle: VehicleDTO;
    startKm: number;
    endKm?: number | null;
    isDamaged: boolean;
    returnDate?: string | null;
    totalFee?: number | null;
    status: RentalItemStatus;
}

export interface RentalDTO {
    id: number;
    customer: CustomerDTO;
    rentalDate: string;
    notes?: string | null;
    items: RentalItemDTO[]; 
}