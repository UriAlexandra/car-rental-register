import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CustomerDTO, VehicleDTO, RentalDTO } from '../../../models';
import { VehicleStatus } from '../../../models/enums';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';

import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../services/vehicle.services';
import { RentalService } from '../services/rental.services';

@Component({
  selector: 'app-customer-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customer-editor.html'
})
export class CustomerEditor implements OnInit {
  customer: CustomerDTO = {
    id: 0,
    name: '',
    address: '',
    idCardNumber: '',
    phoneNumber: '',
    rentals: []
  };

  freeVehicles: VehicleDTO[] = []; // Csak a szabad járművek az új kölcsönzéshez
  selectedVehicleId: number | null = null;

  // Segédváltozók a visszahozatalhoz (lezáráshoz)
  returnDate: string = new Date().toISOString().split('T')[0];
  drivenKmMap: { [rentalId: number]: number } = {};
  isDamagedMap: { [rentalId: number]: boolean } = {};

  customerService = inject(CustomerService);
  vehicleService = inject(VehicleService);
  rentalService = inject(RentalService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  cdRef = inject(ChangeDetectorRef);

  isNew = true;

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];

    // 1. Szabad járművek betöltése a választóhoz
    this.loadFreeVehicles();

    if (id) {
      this.isNew = false;
      this.loadCustomer(id);
    }
  }

  loadCustomer(id: number) {
    this.customerService.getOne(id).subscribe(res => {
      this.customer = res;
      this.cdRef.markForCheck();
    });
  }

  loadFreeVehicles() {
    this.vehicleService.getAll().subscribe(res => {
      // Csak azokat mutatjuk, amik állapota 'Szabad'
      this.freeVehicles = res.filter(v => v.status === VehicleStatus.Free);
      this.cdRef.markForCheck();
    });
  }

  // --- ÜGYFÉL ADATOK MENTÉSE ---
  saveCustomer() {
    const req = this.isNew ? this.customerService.create(this.customer) : this.customerService.update(this.customer);
    req.subscribe(res => {
      if (this.isNew) {
        this.router.navigate(['/customer-editor', res.id]);
      } else {
        alert('Ügyfél adatai elmentve!');
      }
    });
  }

  // --- KÖLCSÖNZÉS INDÍTÁSA ---
  startRental() {
    if (!this.selectedVehicleId) return;

    const newRental = {
      customer: this.customer.id,
      vehicle: this.selectedVehicleId,
      startDate: new Date()
    };

    this.rentalService.create(newRental as any).subscribe({
      next: () => {
        this.selectedVehicleId = null;
        this.loadCustomer(this.customer.id); // Frissítjük a listát
        this.loadFreeVehicles(); // Frissítjük a szabad autókat
      },
      error: (err) => alert(err.error?.error || 'Hiba a kölcsönzés indításakor')
    });
  }

  // --- KÖLCSÖNZÉS LEZÁRÁSA (VISSZAHOZATAL) ---
  finishRental(rentalId: number) {
    const km = this.drivenKmMap[rentalId];
    const damaged = !!this.isDamagedMap[rentalId];

    if (km === undefined || km < 0) {
      alert('Kérlek add meg a megtett kilométerek számát!');
      return;
    }

    this.rentalService.closeRental(rentalId, {
      endDate: this.returnDate,
      drivenKm: km,
      isDamaged: damaged
    }).subscribe({
      next: (res) => {
        alert(`Kölcsönzés lezárva. Fizetendő: ${res.totalFee} Ft`);
        this.loadCustomer(this.customer.id);
        this.loadFreeVehicles();
      },
      error: (err) => alert('Hiba a lezárás során!')
    });
  }

  back() {
    this.router.navigateByUrl('/customers');
  }
}
