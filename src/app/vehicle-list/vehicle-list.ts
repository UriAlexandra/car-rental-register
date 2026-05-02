import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VehicleDTO, VehicleService, VehicleType, VehicleStatus } from '../services/vehicle.services';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.css'
})
export class VehicleList implements OnInit {
  vehicles: VehicleDTO[] = [];
  private vehicleService = inject(VehicleService);

  vehicleTypeEnum = VehicleType;
  vehicleStatusEnum = VehicleStatus;

  ngOnInit(): void {
    this.vehicleService.getAll().subscribe({
      next: (data) => this.vehicles = data,
      error: (err) => console.error('Error fetching vehicles:', err)
    });
  }
}