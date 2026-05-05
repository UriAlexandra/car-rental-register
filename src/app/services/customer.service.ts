import { CustomerDTO } from './../../../models/index';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  http = inject(HttpClient);

  getAll() {
    return this.http.get<CustomerDTO[]>('/api/customer');
  }

  getOne(id: number) {
    return this.http.get<CustomerDTO>('/api/customer/' + id);
  }

  create(customer: CustomerDTO) {
    return this.http.post<CustomerDTO>('/api/customer', customer);
  }

  update(customer: CustomerDTO) {
    return this.http.put<CustomerDTO>('/api/customer', customer);
  }

  delete(id: number) {
    return this.http.delete('/api/customer/' + id);
  }
}
