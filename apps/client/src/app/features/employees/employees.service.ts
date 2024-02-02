import { Injectable } from '@angular/core';
import { api } from '../../common/api';
import { type Employee } from '../../common/employee.types';

@Injectable({
  providedIn: null,
})
export class EmployeesService {
  constructor() {}
  async getAllEmployees() {
    return api.get<Employee[]>('').then(({ data }) => data);
  }
  async getEmployee(employeeId: string) {
    return api.get<Employee>(`/${employeeId}`).then(({ data }) => data);
  }
  async deleteEmployee(employeeId: string) {
    return api.delete<Employee>(`/${employeeId}`).then(({ data }) => data);
  }
  async updateEmployee(employeeId: string, updateInput: Partial<Employee>) {
    return api
      .patch<Employee>(`/${employeeId}`, updateInput)
      .then(({ data }) => data);
  }
  async createEmployee(createInput: Omit<Employee, 'employeeId'>) {
    return api.post<Employee>('', createInput).then(({ data }) => data);
  }
}
