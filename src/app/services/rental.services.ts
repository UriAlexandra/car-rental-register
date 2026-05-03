import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RentalDTO } from './../../../models/index';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private http = inject(HttpClient);

  getAll(){
    return this.http.get<RentalDTO[]>('/api/rental');
  }

  getOne(id: number): Observable<RentalDTO> {
    return this.http.get<RentalDTO>(`/api/rental/${id}`);
  }

  create(rental: RentalDTO): Observable<RentalDTO> {
    return this.http.post<RentalDTO>('/api/rental', rental);
  }

  update(rental: RentalDTO): Observable<RentalDTO> {
    return this.http.put<RentalDTO>(`/api/rental/${rental.id}`, rental);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/rental/${id}`);
  }
}