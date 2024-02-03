import { api } from '../../common/api';
import { type Employee } from '../../common/employee.type';

export async function getAllEmployees() {
  return api.get<Employee[]>('').then(({ data }) => data);
}
export async function getEmployee(employeeId: string) {
  return api.get<Employee>(`/${employeeId}`).then(({ data }) => data);
}
export async function deleteEmployee(employeeId: string) {
  return api.delete<Employee>(`/${employeeId}`).then(({ data }) => data);
}
export async function updateEmployee(
  employeeId: string,
  updateInput: Partial<Employee>,
) {
  return api
    .patch<Employee>(`/${employeeId}`, updateInput)
    .then(({ data }) => data);
}
export async function createEmployee(
  createInput: Omit<Employee, 'employeeId'>,
) {
  return api.post<Employee>('', createInput).then(({ data }) => data);
}
