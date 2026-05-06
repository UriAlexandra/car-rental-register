import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { VehicleDTO } from '../../../models';
import { Router, RouterLink } from '@angular/router';
import { VehicleStatus } from '../../../models/enums';
import { DatePipe } from '@angular/common';
import { VehicleService } from '../services/vehicle.services';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './vehicle-list.html'
})
export class VehicleList implements OnInit {
  vehicleService = inject(VehicleService);
  router = inject(Router);
  cdRef = inject(ChangeDetectorRef);

  vehicles = signal<VehicleDTO[]>([]); // A 'vehicles' tárolja a szerverről kapott TELJES adatbázist.
  filteredVehicles = signal<VehicleDTO[]>([]); //szűrt lista

  // Kereső filterek
  typeFilter = '';
  plateFilter = '';

  ngOnInit(): void {
    this.vehicleService.getAll().subscribe({
      next: (data) => {
        // Betöltéskor mindkét lista megkapja a teljes adathalmazt.
        this.vehicles.set(data);
        this.filteredVehicles.set(data);
      },
      error: (error) => console.error('Hiba a járművek betöltésekor:', error)
    });
  }

  editVehicle(vehicle: VehicleDTO) {
    // Üzleti logika: Nem engedjük szerkeszteni az autót, ha épp ki van adva valakinek.
    if (vehicle.status === VehicleStatus.Rented) {
      alert('Nem szerkesztheted ezt a járművet, mert jelenleg ki van kölcsönözve.');
      return;
    }
    this.router.navigate(['/vehicle-editor', vehicle.id]);
  }

  deleteVehicle(vehicle: VehicleDTO) {
    if (vehicle.status === VehicleStatus.Rented) {
      alert('Nem törölheted ezt a járművet, mert jelenleg ki van kölcsönözve.');
      return;
    }

    if (!confirm(`Biztos törölni akarod a(z) ${vehicle.licensePlate} rendszámú járművet?`)) return;

    this.vehicleService.delete(vehicle.id).subscribe({
      next: () => {
        // Sikeres törlés után mindkét listából (a teljesből és a szűrtből is) kivesszük a törölt elemet.
        this.vehicles.set(this.vehicles().filter(v => v.id !== vehicle.id));
        this.filteredVehicles.set(this.filteredVehicles().filter(v => v.id !== vehicle.id));
        this.cdRef.markForCheck();
      },
      error: (err) => console.error('Hiba törléskor:', err)
    });
  }

  // --- KERESÉSI LOGIKA ---
  searchType(event: Event) {
    //a keresés ne legyen kis/nagybetű érzékeny
    this.typeFilter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilter(); // Meghívjuk a tényleges szűrő függvényt.
  }

  //rendszám keresőnél
  searchPlate(event: Event) {
    this.plateFilter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilter();
  }

  //Szűrési logika: A teljes járműlistán végigmegyünk, és csak azokat hagyjuk meg, amelyek megfelelnek a keresési feltételeknek.
  applyFilter() {
    const result = this.vehicles().filter(v =>
      v.type.toLowerCase().includes(this.typeFilter) &&
      v.licensePlate.toLowerCase().includes(this.plateFilter)
    );
    // Az eredményt beállítjuk a látható listának.
    this.filteredVehicles.set(result);
  }
}
