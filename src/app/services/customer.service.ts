import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomerDTO {
    id?: number;
    name: string;
    address: string;
    idCardNumber: string;
    phone: string;
    email?: string;
    createdAt?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/customer';

  getAll(): Observable<CustomerDTO[]> {
    return this.http.get<CustomerDTO[]>(this.apiUrl);
  }

  // A későbbi funkciókhoz előkészítve
  create(customer: CustomerDTO): Observable<CustomerDTO> {
    return this.http.post<CustomerDTO>(this.apiUrl, customer);
  }
}