import { Routes } from '@angular/router';
import { VehicleList } from './vehicle-list/vehicle-list';
import { VehicleEditor } from './vehicle-editor/vehicle-editor';
import { CustomerList } from './customer-list/customer-list';
import { CustomerEditor } from './customer-editor/customer-editor';


export const routes: Routes = [
  {
    path: '',
    component: VehicleList
  },
  {
    path: 'vehicles',
    component: VehicleList
  },
  {
    path: 'vehicle-editor',
    component: VehicleEditor
  },
  {
    path: 'vehicle-editor/:id',
    component: VehicleEditor
  },
  {
    path: 'customers',
    component: CustomerList
  },
  {
    path: 'customer-editor',
    component: CustomerEditor
  },
  {
    path: 'customer-editor/:id',
    component: CustomerEditor
  }
]
