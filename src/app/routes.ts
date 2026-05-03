import { Routes } from '@angular/router';
import { CustomerList } from './customer-list/customer-list';
import { CustomerEditor } from './customer-editor/customer-editor';
import { VehicleList } from './vehicle-list/vehicle-list';
import { VehicleEditor } from './vehicle-editor/vehicle-editor';
import { RentalList } from './rental-list/rental-list';
import { RentalEditor } from './rental-editor/rental-editor';

export const routes: Routes = [
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: 'customers', component: CustomerList },
  { path: 'create-customer', component: CustomerEditor },
  { path: 'vehicles', component: VehicleList },
  { path: 'create-vehicle', component: VehicleEditor },
  { path: 'rentals', component: RentalList },
  { path: 'create-rental', component: RentalEditor },
  { path: 'create-rental/:id', component: RentalEditor },

];