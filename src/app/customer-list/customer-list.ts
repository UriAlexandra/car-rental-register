import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CustomerDTO, RentalDTO } from '../../../models';
import { CustomerService } from '../services/customer.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './customer-list.html'
})
export class CustomerList implements OnInit {
  customerService = inject(CustomerService);
  router = inject(Router);
  cdRef = inject(ChangeDetectorRef);

  customers = signal<CustomerDTO[]>([]);

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.cdRef.markForCheck();
      },
      error: (err) => console.error('Hiba az ügyfelek betöltésekor:', err)
    });
  }

  // Segédfüggvény: Visszaadja egy ügyfél aktív (még le nem zárt) kölcsönzéseit
  getActiveRentals(customer: CustomerDTO): RentalDTO[] {
    if (!customer.rentals) return [];
    return customer.rentals.filter(r => r.endDate === null);
  }

  deleteCustomer(customer: CustomerDTO) {
    // Védelem: Ha van aktív bérlése (endDate === null), nem törölhetjük!
    const activeRentals = this.getActiveRentals(customer);
    if (activeRentals.length > 0) {
      alert('Ezt az ügyfelet nem törölheted, mert jelenleg is van nála kikölcsönzött jármű!');
      return;
    }

    if (!confirm(`Biztosan törlöd ${customer.name} ügyfelet a rendszerből?`)) return;

    this.customerService.delete(customer.id).subscribe({
      next: () => {
        this.customers.set(this.customers().filter(c => c.id !== customer.id));
        this.cdRef.markForCheck();
      },
      error: (err) => console.error('Hiba törléskor:', err)
    });
  }

  editCustomer(customer: CustomerDTO) {
    this.router.navigate(['/customer-editor', customer.id]);
  }
}
