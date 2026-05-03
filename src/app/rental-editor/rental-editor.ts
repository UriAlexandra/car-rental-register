import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { VehicleService } from '../services/vehicle.services';
import { RentalService } from '../services/rental.services';
import { CustomerDTO, RentalDTO, VehicleDTO, RentalItemDTO } from '../../../models';
import { RentalItemStatus, VehicleStatus } from '../../../models/enums';

@Component({
  selector: 'app-rental-editor',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './rental-editor.html',
  styleUrl: './rental-editor.css'
})
export class RentalEditor implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private cdRef = inject(ChangeDetectorRef);
  
  private customerService = inject(CustomerService);
  private vehicleService = inject(VehicleService);
  private rentalService = inject(RentalService);

  customers: CustomerDTO[] = [];
  freeVehicles: VehicleDTO[] = [];
  errorMessage: string = '';

  isNew: boolean = true;
  rental: RentalDTO = {
    id: 0,
    customer: {} as CustomerDTO,
    rentalDate: new Date().toISOString().split('T')[0],
    notes: '',
    items: []
  };

  rentalForm: FormGroup = this.fb.group({
    customerId: ['', Validators.required],
    rentalDate: ['', Validators.required],
    notes: [''],
    // Jármű hozzáadásához szükséges segédmezők:
    vehicleId: [''], 
    startKm: [null, Validators.min(0)]
  });

  ngOnInit(): void {
    // Ügyfelek betöltése
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers = data;
        this.cdRef.markForCheck();
      },
      error: (err) => console.error('Hiba az ügyfelek betöltésekor:', err)
    });

    // Szabad járművek betöltése
    this.vehicleService.getAll().subscribe({
      next: (data) => {
        this.freeVehicles = data.filter(v => v.status === VehicleStatus.FREE);
        this.cdRef.markForCheck();
      },
      error: (err) => console.error('Hiba a járművek betöltésekor:', err)
    });

    // ID lekérése az útvonalból (szerkesztés vagy új létrehozás ellenőrzése)
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.isNew = false;
      this.rentalService.getOne(id).subscribe({
        next: (res) => {
          this.rental = res;
          // Form feltöltése a meglévő adatokkal
          this.rentalForm.patchValue({
            customerId: res.customer?.id,
            rentalDate: res.rentalDate,
            notes: res.notes
          });
          this.cdRef.markForCheck();
        },
        error: (err) => {
          this.errorMessage = 'Error loading rental.';
          console.error(err);
        }
      });
    } else {
      // Új kölcsönzés esetén a mai nap beállítása alapértelmezettként
      this.rentalForm.patchValue({ rentalDate: this.rental.rentalDate });
    }
  }

  addVehicle() {
    const vehicleId = this.rentalForm.get('vehicleId')?.value;
    const startKm = this.rentalForm.get('startKm')?.value;

    if (vehicleId && startKm !== null) {
      const selectedVehicle = this.freeVehicles.find(v => v.id === Number(vehicleId));

      if (selectedVehicle) {
        // Ellenőrizzük, hogy nincs-e már a listában
        if (!this.rental.items.some(i => i.vehicle.id === selectedVehicle.id)) {
          this.rental.items.push({
            id: 0,
            vehicle: selectedVehicle,
            startKm: startKm,
            isDamaged: false,
            status: RentalItemStatus.ACTIVE
          } as RentalItemDTO);
          
          // Form mezők ürítése a sikeres hozzáadás után
          this.rentalForm.patchValue({ vehicleId: '', startKm: null });
          this.cdRef.markForCheck();
        } else {
          alert('You have already added this vehicle to the rental!');
        }
      }
    } else {
      alert('Please select a vehicle and enter the starting odometer reading!');
    }
  }

  removeVehicle(index: number) {
    this.rental.items.splice(index, 1);
    this.cdRef.markForCheck();
  }

  saveRental() {
    if (this.rentalForm.valid && this.rental.items.length > 0) {
      const formValues = this.rentalForm.value;

      // Összeállítjuk/frissítjük a DTO-t a formból származó adatokkal
      this.rental.customer = { id: Number(formValues.customerId) } as CustomerDTO;
      this.rental.rentalDate = formValues.rentalDate;
      this.rental.notes = formValues.notes;

      // Ternary operátorral eldöntjük, hogy create vagy update requestet indítunk
      const req = this.isNew ? this.rentalService.create(this.rental) : this.rentalService.update(this.rental);
      
      req.subscribe({
        next: () => this.router.navigateByUrl('/rentals'),
        error: (err) => {
          this.errorMessage = err.error?.error || 'Error occurred while saving the rental.';
          console.error(err);
          this.cdRef.markForCheck();
        }
      });
    } else {
      if (this.rental.items.length === 0) {
        this.errorMessage = 'Please add at least one vehicle to the rental!';
      }
      this.rentalForm.markAllAsTouched();
      this.cdRef.markForCheck();
    }
  }

  cancel() {
    this.router.navigateByUrl('/rentals');
  }

  isInvalid(controlName: string): boolean {
    const control = this.rentalForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}