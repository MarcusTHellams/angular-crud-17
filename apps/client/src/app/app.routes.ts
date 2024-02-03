import { Routes } from '@angular/router';
import { EmployeeComponent } from './features/employees/employee.component';
import { EmployeeDetailsComponent } from './features/employees/employee-details.component';

export const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
  },
  {
    path: ':employeeId',
    component: EmployeeDetailsComponent,
  },
];
