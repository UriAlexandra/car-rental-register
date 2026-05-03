import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { Router} from '@angular/router';
import { DatePipe } from '@angular/common';
import { RentalService } from '../services/rental.services';
import { RentalItemStatus } from '../../../models/enums';
import { RentalDTO, VehicleDTO } from '../../../models';

@Component({
  selector: 'app-rental-list',
  standalone: true,
  imports: [DatePipe], //dátumok formázásához
  templateUrl: './rental-list.html',
  styleUrl: './rental-list.css'
})
export class RentalList implements OnInit {
  rentals = signal<RentalDTO[]>([]);
  vehicles: VehicleDTO[] = [];
  rentalService = inject(RentalService);
  router = inject(Router);
  cdRef = inject(ChangeDetectorRef);

  rentalItemStatusEnum = RentalItemStatus;

  ngOnInit(): void {
    this.rentalService.getAll().subscribe({
      next: (data) => this.rentals.set(data),
      error: (err) => console.error('Error retrieving rentals:', err)
    });
  }

  newRental() {
    this.router.navigateByUrl('/create-rental');
  }

  deleteRental(rental: RentalDTO) {
    if (!confirm(`Are you sure you want to delete "${rental.customer.name}" rental?`)) return;

    this.rentalService.delete(rental.id).subscribe({
      next: () => {
        const currentRental = this.rentals();
        const index = currentRental.indexOf(rental);
        if (index > -1) {
          currentRental.splice(index, 1);
          this.rentals.set([...currentRental]);
        }
      },
      error: (err) => {
        alert('Error during deleting rental.');
        console.error('Error during deleting rental', err);
      }
    });
  }

    editRental(rental: RentalDTO) {
    this.router.navigate(['/create-rental', rental.id]);
  }
}