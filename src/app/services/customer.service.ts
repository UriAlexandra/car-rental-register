import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerDTO } from './../../../models/index';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<CustomerDTO[]>('/api/customer');
  }

  // A későbbi funkciókhoz előkészítve
  create(customer: CustomerDTO) {
    return this.http.post<CustomerDTO>('/api/customer', customer);
  }
}