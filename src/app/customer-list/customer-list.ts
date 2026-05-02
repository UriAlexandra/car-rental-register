import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomerService, CustomerDTO } from '../services/customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerList implements OnInit {
  customers: CustomerDTO[] = [];
  private customerService = inject(CustomerService);

  ngOnInit(): void {
    this.customerService.getAll().subscribe({
      next: (data) => this.customers = data,
      error: (err) => console.error('Error fetching customers:', err)
    });
  }
}