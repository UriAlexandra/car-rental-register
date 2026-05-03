import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VehicleService } from '../services/vehicle.services';
import { VehicleStatus, VehicleType } from '../../../models/enums';

@Component({
  selector: 'app-vehicle-editor',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './vehicle-editor.html',
  styleUrl: './vehicle-editor.css'
})
export class VehicleEditor {
  private fb = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  private router = inject(Router);

  // Elérhetővé tesszük a HTML számára az enum típusokat
  vehicleTypes = Object.values(VehicleType);
  
  // Űrlap definíciója
  vehicleForm: FormGroup = this.fb.group({
    vehicleType: [VehicleType.CAR, Validators.required],
    manufacturer: ['', Validators.required],
    model: ['', Validators.required],
    licensePlate: [''], // Opcionális, vízijárműveknél gyakran nincs
    chassisNumber: ['', Validators.required],
    purchaseDate: ['', Validators.required],
    serialNumber: ['', Validators.required],
    // A díjakhoz hozzáadunk egy minimum validációt is
    dailyRate: [null, [Validators.required, Validators.min(0)]],
    kmRate: [null, [Validators.required, Validators.min(0)]],
    damageFee: [null, [Validators.required, Validators.min(0)]],
    status: [VehicleStatus.FREE, Validators.required] // Alapértelmezésben szabad a jármű[cite: 1]
  });

  errorMessage: string = '';

  onSubmit(): void {
    if (this.vehicleForm.valid) {
      this.vehicleService.create(this.vehicleForm.value).subscribe({
        next: () => {
          this.router.navigate(['/vehicles']);
        },
        error: (err) => {
          // Itt jelenítjük meg a backend által küldött "foglalt rendszám/alvázszám" hibaüzenetet[cite: 1]
          this.errorMessage = err.error?.error || 'An unexpected error occurred while saving the vehicle.';
          console.error(err);
        }
      });
    } else {
      this.vehicleForm.markAllAsTouched();
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.vehicleForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}