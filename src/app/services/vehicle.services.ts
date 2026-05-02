import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum VehicleType {
    CAR = 'CAR',
    WATERCRAFT = 'WATERCRAFT'
}

export enum VehicleStatus {
    FREE = 'FREE',
    RENTED = 'RENTED',
    SCRAPPED = 'SCRAPPED'
}

export interface VehicleDTO {
    id?: number;
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

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/vehicle'; 

  getAll(): Observable<VehicleDTO[]> {
    return this.http.get<VehicleDTO[]>(this.apiUrl);
  }

  getOne(id: number): Observable<VehicleDTO> {
    return this.http.get<VehicleDTO>(`${this.apiUrl}/${id}`);
  }

  create(vehicle: VehicleDTO): Observable<VehicleDTO> {
    return this.http.post<VehicleDTO>(this.apiUrl, vehicle);
  }

  update(vehicle: VehicleDTO): Observable<VehicleDTO> {
    return this.http.put<VehicleDTO>(this.apiUrl, vehicle);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}