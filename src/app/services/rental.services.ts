import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RentalDTO } from './../../../models/index';

@Injectable({
  providedIn: 'root',
})
export class RentalService {
  http = inject(HttpClient);

  getAll() {
    return this.http.get<RentalDTO[]>('/api/rental');
  }

  getOne(id: number) {
    return this.http.get<RentalDTO>('/api/rental/' + id);
  }

  create(rental: RentalDTO) {
    return this.http.post<RentalDTO>('/api/rental', rental);
  }

  closeRental(id: number, data: { endDate: string | Date, drivenKm: number, isDamaged: boolean }) {
    return this.http.put<RentalDTO>(`/api/rental/${id}/close`, data);
  }

  delete(id: number) {
    return this.http.delete('/api/rental/' + id);
  }
}
