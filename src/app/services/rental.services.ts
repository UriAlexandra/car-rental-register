import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerDTO } from './customer.service';
import { VehicleDTO } from './vehicle.services';

export enum RentalItemStatus {
    PENDING = 'PENDING',
    RETURNED = 'RETURNED',
    DAMAGED = 'DAMAGED',
    ACTIVE = 'ACTIVE'
}

export interface RentalItemDTO {
    id?: number;
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
    id?: number;
    customer: CustomerDTO;
    rentalDate: string;
    notes?: string | null;
    items: RentalItemDTO[]; 
}

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/rental'; 

  getAll(): Observable<RentalDTO[]> {
    return this.http.get<RentalDTO[]>(this.apiUrl);
  }

  getOne(id: number): Observable<RentalDTO> {
    return this.http.get<RentalDTO>(`${this.apiUrl}/${id}`);
  }

  create(rental: RentalDTO): Observable<RentalDTO> {
    return this.http.post<RentalDTO>(this.apiUrl, rental);
  }

  update(rental: RentalDTO): Observable<RentalDTO> {
    return this.http.put<RentalDTO>(this.apiUrl, rental);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}