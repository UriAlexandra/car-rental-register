import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer-editor',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink], 
  templateUrl: './customer-editor.html',
  styleUrl: './customer-editor.css'
})
export class CustomerEditor {
  fb = inject(FormBuilder);
  customerService = inject(CustomerService);
  router = inject(Router);

  customerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    idCardNumber: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.email]
  });

  errorMessage: string = '';

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.customerService.create(this.customerForm.value).subscribe({
        next: () => this.router.navigate(['/customers']),
        error: (err) => {
          this.errorMessage = err.error?.error || 'Váratlan hiba történt a mentés során.';
          console.error(err);
        }
      });
    } else {
      this.customerForm.markAllAsTouched();
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.customerForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}