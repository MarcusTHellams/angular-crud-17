import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { CommonModule } from '@angular/common';
import { EmployeesService } from './employees.service';
import { Employee } from '../../common/employee.types';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { EmployeeFormComponent } from './employee-form.component';
import { RerenderDirective } from '../../common/directives/rerender.directive';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'employee',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    DialogModule,
    EmployeeFormComponent,
    ToastModule,
    RerenderDirective,
    RouterModule,
  ],
  providers: [EmployeesService, MessageService],
  template: `
    <div class="flex justify-between items-center mb-6">
      <h4 class="font-bold text-2xl"></h4>
      <p-button
        [rounded]="true"
        size="small"
        type="button"
        (click)="openModal()"
      >
        Add Employee
      </p-button>
    </div>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      @if (employees()) {
        <p-table [columns]="columns" [value]="employees()!">
          <ng-template pTemplate="caption">
            <div class="table-header">Manage Employees</div>
          </ng-template>
          <ng-template pTemplate="header" let-columns>
            <tr>
              @for (column of columns; track $index; let last = $last) {
                @if (last) {
                  <th>
                    <span class="sr-only">{{ column }}</span>
                  </th>
                } @else {
                  <th>{{ column }}</th>
                }
              }
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-rowData let-columns="columns">
            <tr>
              @for (column of columns; track column; let last = $last) {
                @if (!last) {
                  <td>{{ rowData[column.toLowerCase()] }}</td>
                } @else {
                  <td class="flex gap-1 items-center">
                    <a
                      [routerLink]="['/', rowData.employeeId]"
                      class="p-ripple p-element p-button p-component p-button-link p-button-sm"
                      >View</a
                    >
                    <p-button
                      (click)="loadEmployee(rowData)"
                      [text]="true"
                      size="small"
                      >Edit</p-button
                    >
                    <p-button
                      (click)="deleteEmployee(rowData.employeeId)"
                      [text]="true"
                      severity="danger"
                      size="small"
                      >Delete</p-button
                    >
                  </td>
                }
              }
            </tr>
          </ng-template>
        </p-table>
      }
    </div>
    <p-dialog
      header="Employee Details"
      [modal]="true"
      appendTo="body"
      [visible]="isModelOpen()"
      (visibleChange)="closeModal()"
      [style]="{ width: '30vw' }"
    >
      <employee-form
        *rerender="isModelOpen()"
        [employee]="employee()"
        (onCloseModal)="closeModal()"
      ></employee-form>
    </p-dialog>
    <p-toast></p-toast>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeComponent {
  isModelOpen = signal(false);
  employee = signal<Employee | undefined>(undefined);
  private employeesService = inject(EmployeesService);
  private messageService = inject(MessageService);
  queryClient = injectQueryClient();
  columns = ['NAME', 'EMAIL', 'MOBILE', 'DOB', 'Edit'];

  query = injectQuery(() => ({
    queryKey: ['employees'],
    queryFn: () => {
      return this.employeesService.getAllEmployees();
    },
  }));

  deleteEmployeeMutation = injectMutation<Employee, Error, string>(() => ({
    mutationKey: ['delete', this.employee()?.employeeId],
    mutationFn: async (employeeId) => {
      return this.employeesService.deleteEmployee(employeeId);
    },
    onSuccess: (data, variables, context) => {
      this.queryClient.invalidateQueries({ queryKey: ['employees'] });
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Employee Successfully Deleted',
      });
    },
  }));
  employees = this.query.data;

  loadEmployee(employee: Employee) {
    this.employee.set(employee);
    this.isModelOpen.set(true);
  }
  deleteEmployee(employeeId: string) {
    this.deleteEmployeeMutation.mutate(employeeId);
  }

  openModal() {
    this.isModelOpen.set(true);
  }

  closeModal() {
    this.isModelOpen.set(false);
    this.employee.set(undefined);
    this.queryClient.invalidateQueries({ queryKey: ['employees'] });
  }
}
