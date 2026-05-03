import { Component, OnInit, inject, signal } from '@angular/core';
import { Router} from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { CustomerDTO } from '../../../models';

@Component({
  selector: 'app-customer-list',
  imports: [],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerList implements OnInit {
  customers = signal<CustomerDTO[]>([]);
  customerService = inject(CustomerService);
  router = inject(Router);
  
  ngOnInit(): void {
    this.customerService.getAll().subscribe({
      next: (data) => this.customers.set(data),
      error: (err) => console.error('Error fetching customers:', err)
    });
  }

  create() {
    this.router.navigate(['/create-customer']);
  }
}