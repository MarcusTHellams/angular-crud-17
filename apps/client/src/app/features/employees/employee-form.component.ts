import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  effect,
  inject,
  input,
} from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Employee } from '../../common/employee.types';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { EmployeesService } from './employees.service';

@Component({
  selector: 'employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
  ],
  template: `<!-- <h5
      class="mb-5 text-lg font-bold tracking-tight text-gray-900 dark:text-white "
    >
      Employee Details
    </h5> -->
    <form
      [formGroup]="employeeForm"
      #ngForm="ngForm"
      class="w-full"
      (ngSubmit)="handleSubmit()"
      novalidate
    >
      <div class="mb-5">
        <label
          for="name"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Name</label
        >
        <input
          type="text"
          id="name"
          pInputText
          class="w-full"
          formControlName="name"
        />
        @if (
          name?.invalid && (ngForm.submitted || name?.dirty || name?.touched)
        ) {
          @if (name?.hasError('required')) {
            <div class="text-red-500">Name is Required</div>
          }
        }
      </div>
      <div class="mb-5">
        <label
          for="email"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Email</label
        >
        <input
          type="text"
          id="email"
          pInputText
          class="w-full"
          formControlName="email"
        />
        @if (
          email?.invalid && (ngForm.submitted || email?.dirty || email?.touched)
        ) {
          @if (email?.hasError('required')) {
            <div class="text-red-500">Email is Required</div>
          }
          @if (email?.hasError('email')) {
            <div class="text-red-500">Email must be a Valid Email</div>
          }
        }
      </div>
      <div class="mb-5">
        <label
          for="mobile"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Mobile</label
        >
        <input
          type="text"
          id="mobile"
          pInputText
          class="w-full"
          formControlName="mobile"
        />
        @if (
          mobile?.invalid &&
          (ngForm.submitted || mobile?.dirty || mobile?.touched)
        ) {
          @if (mobile?.hasError('required')) {
            <div class="text-red-500">Mobile is Required</div>
          }
        }
      </div>
      <div class="mb-5">
        <label
          for="dob"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >DOB</label
        >

        <p-calendar
          [showClear]="true"
          id="dob"
          appendTo="body"
          styleClass="w-full"
          formControlName="dob"
        ></p-calendar>

        @if (dob?.invalid && (ngForm.submitted || dob?.dirty || dob?.touched)) {
          @if (dob?.hasError('required')) {
            <div class="text-red-500">DOB is Required</div>
          }
        }
      </div>
      <div class="mb-5">
        <label
          for="doj"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >DOJ</label
        >
        <p-calendar
          [showClear]="true"
          id="doj"
          appendTo="body"
          styleClass="w-full"
          formControlName="doj"
        ></p-calendar>
        @if (doj?.invalid && (ngForm.submitted || doj?.dirty || doj?.touched)) {
          @if (doj?.hasError('required')) {
            <div class="text-red-500">DOJ is Required</div>
          }
        }
      </div>
      <div class="flex gap-1">
        <p-button [disabled]="ngForm.invalid!" type="submit">Submit</p-button>
        <p-button severity="secondary" (click)="onClose()" type="button"
          >Cancel</p-button
        >
      </div>
    </form> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormComponent {
  constructor() {
    effect(() => {
      if (this.employee()) {
        this.employeeForm.patchValue({
          name: this.employee()?.name,
          email: this.employee()?.email,
          mobile: this.employee()?.mobile,
          dob: new Date(this.employee()!.dob),
          doj: new Date(this.employee()!.doj),
        });
      }
    });
  }
  employee = input<Employee | undefined>(undefined);
  @Output() onCloseModal = new EventEmitter();
  messageService = inject(MessageService);

  employeesService = inject(EmployeesService);

  employeeForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobile: new FormControl('', [Validators.required]),
    dob: new FormControl(new Date(), [Validators.required]),
    doj: new FormControl(new Date(), [Validators.required]),
  });

  createMutation = injectMutation<
    Employee,
    Error,
    Omit<Employee, 'employeeId'>
  >(() => ({
    mutationKey: ['createEmployee'],
    mutationFn: async (employee) => {
      return this.employeesService.createEmployee(employee);
    },
    onSuccess: () => {
      this.showSuccessfulToast('Employee Successfully Created');
      this.onClose();
    },
  }));

  updateMutation = injectMutation<Employee, Error, Partial<Employee>>(() => ({
    mutationKey: ['updateEmployee'],
    mutationFn: async (employee) => {
      console.log('this.employee()!.employeeId: ', this.employee()!.employeeId);
      console.log('employee: ', employee);
      return this.employeesService.updateEmployee(
        this.employee()!.employeeId,
        employee,
      );
    },
    onSuccess: () => {
      this.showSuccessfulToast('Employee Successfully Updated');
      this.onClose();
    },
  }));

  get name() {
    return this.employeeForm.get('name');
  }

  get email() {
    return this.employeeForm.get('email');
  }

  get mobile() {
    return this.employeeForm.get('mobile');
  }

  get dob() {
    return this.employeeForm.get('dob');
  }
  get doj() {
    return this.employeeForm.get('doj');
  }

  onClose() {
    this.onCloseModal.emit();
  }
  formatDate(date: Date) {
    return formatDate(date, 'LL-dd-yyyy', 'en-us');
  }
  handleSubmit() {
    if (this.employeeForm.invalid) return;
    if (this.employee()) {
      this.updateMutation.mutate({
        ...(this.employeeForm.value as unknown as Omit<Employee, 'employeeId'>),
        dob: this.formatDate(this.dob?.value as Date),
        doj: this.formatDate(this.doj?.value as Date),
      });
      return;
    }
    this.createMutation.mutate({
      ...(this.employeeForm.value as unknown as Omit<Employee, 'employeeId'>),
      dob: this.formatDate(this.dob?.value as Date),
      doj: this.formatDate(this.doj?.value as Date),
    });
    return;
  }

  showSuccessfulToast(detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: detail,
    });
  }
}
