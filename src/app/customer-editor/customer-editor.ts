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
// Az OnInit interfész implementálása kötelez minket az ngOnInit() metódus megírására.
export class CustomerEditor implements OnInit {
  // Kezdeti állapot egy üres ügyféllel
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

  // Segédváltozók a visszahozatalhoz (lezáráshoz),bérlés ID-jához (kulcs) kötjük az értéket
  returnDate: string = new Date().toISOString().split('T')[0];
  drivenKmMap: { [rentalId: number]: number } = {};
  isDamagedMap: { [rentalId: number]: boolean } = {};

  // Az inject() funkcióval hozzuk be a szükséges szolgáltatásokat és routing modulokat (Dependency Injection).
  customerService = inject(CustomerService);
  vehicleService = inject(VehicleService);
  rentalService = inject(RentalService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  cdRef = inject(ChangeDetectorRef);

  // Az inject() funkcióval hozzuk be a szükséges szolgáltatásokat és routing modulokat (Dependency Injection).
  isNew = true;

  ngOnInit(): void {
    // Kinyerjük az URL-ből az ID-t
    const id = this.activatedRoute.snapshot.params['id'];

    // 1. Szabad járművek betöltése a választóhoz
    this.loadFreeVehicles();

    // Ha van ID, akkor egy már létező ügyfelet szerkesztünk.
    if (id) {
      this.isNew = false;
      this.loadCustomer(id);
    }
  }

  // Lekéri a backendről az ügyfél adatait a CustomerService segítségével.
  loadCustomer(id: number) {
    this.customerService.getOne(id).subscribe(res => {
      this.customer = res; //felülírja a 'customer' változót, ami frissíti a HTML űrlapot.
      this.cdRef.markForCheck(); //Angular frissítse a felületet
    });
  }

  loadFreeVehicles() {
    this.vehicleService.getAll().subscribe(res => {
// Kiszűrjük azokat az autókat, amik épp elérhetőek.
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

    // Létrehozzuk az új bérlés objektumot az ügyfél és a kiválasztott autó ID-jával.
    const newRental = {
      customer: this.customer.id,
      vehicle: this.selectedVehicleId,
      startDate: new Date()
    };

    // Elküldjük a backendnek.
    this.rentalService.create(newRental as any).subscribe({
      next: () => {
        this.selectedVehicleId = null; // Kinullázzuk a kiválasztót
        this.loadCustomer(this.customer.id); // Frissítjük a listát
        this.loadFreeVehicles(); // Frissítjük a szabad autókat
      },
      error: (err) => alert(err.error?.error || 'Hiba a kölcsönzés indításakor')
    });
  }

  // --- KÖLCSÖNZÉS LEZÁRÁSA (VISSZAHOZATAL) ---
  finishRental(rentalId: number) {
    // Kinyerjük a specifikus bérléshez a HTML-ben beírt adatokat a 'Map'-ből.
    const km = this.drivenKmMap[rentalId];
    const damaged = !!this.isDamagedMap[rentalId];

    if (km === undefined || km < 0) {
      alert('Kérlek add meg a megtett kilométerek számát!');
      return;
    }

    // API hívás a lezáráshoz.
    this.rentalService.closeRental(rentalId, {
      endDate: this.returnDate,
      drivenKm: km,
      isDamaged: damaged
    }).subscribe({
      next: (res) => {
        alert(`Kölcsönzés lezárva. Fizetendő: ${res.totalFee} Ft`);
        // Adatok frissítése a felületen.
        this.loadCustomer(this.customer.id);
        this.loadFreeVehicles();
      },
      error: (err) => alert('Hiba a lezárás során!')
    });
  }

  // Visszairányít a gyökérkönyvtár
  back() {
    this.router.navigateByUrl('/customers');
  }
}
