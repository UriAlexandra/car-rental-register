import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RentalDTO, RentalItemStatus, RentalService } from '../services/rental.services';

@Component({
  selector: 'app-rental-list',
  standalone: true,
  imports: [RouterLink, DatePipe], //dátumok formázásához
  templateUrl: './rental-list.html',
  styleUrl: './rental-list.css'
})
export class RentalList implements OnInit {
  rentals: RentalDTO[] = [];
  private rentalService = inject(RentalService);

  rentalItemStatusEnum = RentalItemStatus;

  ngOnInit(): void {
    this.rentalService.getAll().subscribe({
      next: (data) => this.rentals = data,
      error: (err) => console.error('Hiba a kölcsönzések lekérésekor:', err)
    });
  }
}