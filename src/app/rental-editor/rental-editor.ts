import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerService, CustomerDTO } from '../services/customer.service';
import { VehicleService, VehicleDTO, VehicleStatus } from '../services/vehicle.services';
import { RentalService, RentalDTO, RentalItemStatus } from '../services/rental.services';

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
  
  private customerService = inject(CustomerService);
  private vehicleService = inject(VehicleService);
  private rentalService = inject(RentalService);

  customers: CustomerDTO[] = [];
  freeVehicles: VehicleDTO[] = [];
  errorMessage: string = '';

  rentalForm: FormGroup = this.fb.group({
    customerId: ['', Validators.required],
    vehicleId: ['', Validators.required],
    rentalDate: ['', Validators.required],
    startKm: [null, [Validators.required, Validators.min(0)]],
    notes: ['']
  });

  ngOnInit(): void {
    // 1. Ügyfelek betöltése a legördülőhöz
    this.customerService.getAll().subscribe({
      next: (data) => this.customers = data,
      error: (err) => console.error('Hiba az ügyfelek betöltésekor:', err)
    });

    // 2. Szabad járművek betöltése
    this.vehicleService.getAll().subscribe({
      next: (data) => {
        // Csak a szabad járműveket tartjuk meg[cite: 1]
        this.freeVehicles = data.filter(v => v.status === VehicleStatus.FREE);
      },
      error: (err) => console.error('Hiba a járművek betöltésekor:', err)
    });

    // Kezdő dátum beállítása a mai napra (YYYY-MM-DD formátum az input type="date" miatt)
    const today = new Date().toISOString().split('T')[0];
    this.rentalForm.patchValue({ rentalDate: today });
  }

  onSubmit(): void {
    if (this.rentalForm.valid) {
      const formValues = this.rentalForm.value;

      // Összeállítjuk a DTO-t a backend által elvárt struktúra alapján[cite: 1]
      const newRental: RentalDTO = {
        customer: { id: Number(formValues.customerId) } as CustomerDTO,
        rentalDate: formValues.rentalDate,
        notes: formValues.notes,
        items: [
          {
            vehicle: { id: Number(formValues.vehicleId) } as VehicleDTO,
            startKm: formValues.startKm,
            isDamaged: false,
            status: RentalItemStatus.ACTIVE // Az új tétel rögtön aktív lesz[cite: 1]
          }
        ]
      };

      this.rentalService.create(newRental).subscribe({
        next: () => {
          // Ha sikeresen mentettük a kölcsönzést, visszatérünk a listához
          this.router.navigate(['/rentals']);
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Error occurred while saving the rental.';
          console.error(err);
        }
      });
    } else {
      this.rentalForm.markAllAsTouched();
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.rentalForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}