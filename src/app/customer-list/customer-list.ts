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

  // A 'customers' egy Signal, ami egy CustomerDTO tömböt tárol. 
  // Kezdeti értéke egy üres tömb: ([]).
  customers = signal<CustomerDTO[]>([]);

  // Ez a metódus az oldal betöltésekor automatikusan lefut.
  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getAll().subscribe({
      next: (data) => {
        // A Signal értékét a .set() metódussal frissítjük a szervertől kapott adatokra (data).
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

    // Megerősítést kérünk a böngésző beépített popupjával.
    if (!confirm(`Biztosan törlöd ${customer.name} ügyfelet a rendszerből?`)) return;

    this.customerService.delete(customer.id).subscribe({
      next: () => {
        // A .filter() segítségével kivesszük a törölt ügyfelet a helyi listából.
        // A this.customers() hívás lekéri az aktuális tömböt, a .set() pedig beállítja az új, szűrt tömböt.
        this.customers.set(this.customers().filter(c => c.id !== customer.id));
        this.cdRef.markForCheck();
      },
      error: (err) => console.error('Hiba törléskor:', err)
    });
  }

  editCustomer(customer: CustomerDTO) {
    // Navigáció a szerkesztő oldalra, hozzáfűzve az URL-hez az ügyfél ID-ját (pl. /customer-editor/5)
    this.router.navigate(['/customer-editor', customer.id]);
  }
}
