import { CustomerDTO } from './../../../models/index';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  //függőség injektálás
  http = inject(HttpClient);

  // Lekéri az összes ügyfelet (GET kérés).
  getAll() {
    return this.http.get<CustomerDTO[]>('/api/customer');
  }

  // Lekér egy adott ügyfelet az azonosítója (id)
  getOne(id: number) {
    return this.http.get<CustomerDTO>('/api/customer/' + id);
  }

  // Létrehoz egy új ügyfelet.
  create(customer: CustomerDTO) {
    return this.http.post<CustomerDTO>('/api/customer', customer);
  }

  // Frissíti egy meglévő ügyfél adatait.
  update(customer: CustomerDTO) {
    return this.http.put<CustomerDTO>('/api/customer', customer);
  }

  // Töröl egy ügyfelet az azonosítója alapján. (DELETE kérés)
  delete(id: number) {
    return this.http.delete('/api/customer/' + id);
  }
}
