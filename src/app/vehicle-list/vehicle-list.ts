import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VehicleService } from '../services/vehicle.services';
import { VehicleDTO } from '../../../models';
import { VehicleStatus, VehicleType } from '../../../models/enums';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.css'
})
export class VehicleList implements OnInit {
  vehicles: VehicleDTO[] = [];
  vehicleService = inject(VehicleService);

  vehicleTypeEnum = VehicleType;
  vehicleStatusEnum = VehicleStatus;

  ngOnInit(): void {
    this.vehicleService.getAll().subscribe({
      next: (data) => this.vehicles = data,
      error: (err) => console.error('Error fetching vehicles:', err)
    });
  }
}