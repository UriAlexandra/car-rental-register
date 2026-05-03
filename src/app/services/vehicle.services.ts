import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleDTO } from './../../../models/index';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<VehicleDTO[]>('/api/vehicle');
  }

  getOne(id: number): Observable<VehicleDTO> {
    return this.http.get<VehicleDTO>(`/api/vehicle/${id}`);
  }

  create(vehicle: VehicleDTO): Observable<VehicleDTO> {
    return this.http.post<VehicleDTO>('/api/vehicle', vehicle);
  }

  update(vehicle: VehicleDTO): Observable<VehicleDTO> {
    return this.http.put<VehicleDTO>(`/api/vehicle/${vehicle.id}`, vehicle);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/vehicle/${id}`);
  }
}