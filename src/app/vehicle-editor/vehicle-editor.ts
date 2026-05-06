import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { VehicleDTO } from '../../../models';
import { VehicleStatus, VehicleType } from '../../../models/enums';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../services/vehicle.services';

@Component({
  selector: 'app-vehicle-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vehicle-editor.html'
})
export class VehicleEditor implements OnInit {
  // Inicializálunk egy üres/alapértelmezett járművet az adatkötéshez.
  vehicle: VehicleDTO = {
    id: 0,
    type: VehicleType.Car, // Alapértelmezett típus
    manufacturer: '',
    licensePlate: '',
    chassisNumber: '',
    purchaseDate: new Date().toISOString().split('T')[0] as any, // Mai nap alapértelmezetten
    serialNumber: '',
    dailyFee: 0,
    kmFee: 0,
    status: VehicleStatus.Free
  };

  //Enumokból tömnböt készítünk a legördülő választóhoz
  types = Object.values(VehicleType);
  statuses = Object.values(VehicleStatus);

  // Szükséges Angular eszközök és saját service-ek behúzása.
  vehicleService = inject(VehicleService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  cdRef = inject(ChangeDetectorRef);


  isNew = true;

  ngOnInit(): void {
    // Lekérjük az URL-ből az 'id' paramétert.
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.isNew = false;
      // Ha van ID, lekérjük az adatokat a szerverről.
      this.vehicleService.getOne(id).subscribe({
        next: (data) => {
          this.vehicle = data;
          // Dátum formázása a HTML <input type="date"> számára (levágjuk az időzónát)
          if (this.vehicle.purchaseDate) {
            this.vehicle.purchaseDate = new Date(this.vehicle.purchaseDate).toISOString().split('T')[0] as any;
          }
          this.cdRef.markForCheck();
        },
        error: (err) => alert('Hiba az adatok betöltésekor!')
      });
    }
  }

  save() {
    // Biztonsági ellenőrzés
    if (!this.vehicle.licensePlate || !this.vehicle.manufacturer) {
      alert('A gyártó és a rendszám megadása kötelező!');
      return;
    }

    // Eldöntjük, hogy új rögzítése (create) vagy meglévő frissítése (update) fog történni az API felé.
    const request = this.isNew
      ? this.vehicleService.create(this.vehicle)
      : this.vehicleService.update(this.vehicle);

      // Elküldjük a kérést, és siker esetén visszavisszük a felhasználót a listára.
    request.subscribe({
      next: () => this.router.navigateByUrl('/vehicles'),
      error: (err) => console.error('Hiba mentéskor', err)
    });
  }

    cancel() {
    this.router.navigateByUrl('/vehicles');
  }
}
