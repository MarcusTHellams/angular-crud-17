import { createBrowserRouter } from 'react-router-dom';
import { Employees } from '../features/employees/Employees';
import { EmployeeDetails } from '../features/employees/EmployeeDetails';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Employees />,
  },
  {
    path: '/:employeeId',
    element: <EmployeeDetails />,
  },
]);
