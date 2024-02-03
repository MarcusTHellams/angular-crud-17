import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { EmployeesService } from './employees.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'employee-details',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterModule],
  providers: [EmployeesService],
  template: `
    @if (employee()) {
      <div class="h-[100vh] flex items-center justify-center">
        <div class="w-[40vw]">
          <p-card [header]="employee()!.name">
            <dl class="grid grid-cols-12 m-0">
              <dt class="col-span-12 sm:col-span-3 font-extrabold">Email:</dt>
              <dd class="col-span-12 sm:col-span-9 ml-0 mb-2">
                {{ employee()!.email }}
              </dd>
              <dt class="col-span-12 sm:col-span-3 font-extrabold">Mobile:</dt>
              <dd class="col-span-12 sm:col-span-9 ml-0 mb-2">
                {{ employee()!.mobile }}
              </dd>
              <dt class="col-span-12 sm:col-span-3 font-extrabold">
                Date of Birth:
              </dt>
              <dd class="col-span-12 sm:col-span-9 ml-0 mb-2">
                {{ employee()!.dob }}
              </dd>
              <dt class="col-span-12 sm:col-span-3 font-extrabold">
                Date Joined:
              </dt>
              <dd class="col-span-12 sm:col-span-9 ml-0 mb-2">
                {{ employee()!.doj }}
              </dd>
            </dl>
            <ng-template pTemplate="footer">
              <a
                [routerLink]="['/']"
                class="p-ripple p-element p-button p-component p-button-sm no-underline"
                >Back</a
              >
            </ng-template>
          </p-card>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailsComponent {
  activatedRoute = inject(ActivatedRoute);
  employeeService = inject(EmployeesService);
  employeeId = this.activatedRoute.snapshot.params['employeeId'] as string;
  query = injectQuery(() => ({
    queryKey: ['employee', this.employeeId],
    queryFn: async () => {
      return this.employeeService.getEmployee(this.employeeId);
    },
  }));
  employee = this.query.data;
}
