import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { MutableRefObject, useCallback, useRef, useState } from 'react';
import { getAllEmployees, deleteEmployee, type Employee } from 'crud-utils';
import { Toast } from 'primereact/toast';

import { Dialog } from 'primereact/dialog';
import { EmployeeForm } from './EmployeeForm';

const columns = [
  {
    field: 'name',
    header: 'NAME',
  },
  {
    field: 'email',
    header: 'EMAIL',
  },
  {
    field: 'mobile',
    header: 'MOBILE',
  },
  {
    field: 'dob',
    header: 'DATE OF BIRTH',
  },
  {
    field: 'doj',
    header: 'DATE JOINED',
  },
  {
    field: '',
    header: 'EDIT',
  },
];

const Header = ({ header }: { header: string }) => {
  return (
    <>
      <span className="sr-only">{header}</span>
    </>
  );
};

export const Employees = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employee, setEmployee] = useState<Employee | undefined>(undefined);
  const queryClient = useQueryClient();
  const toast = useRef(null);

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn() {
      return getAllEmployees();
    },
  });

  const { mutate } = useMutation<Employee, Error, string>({
    mutationKey: ['deleteEmployee', employee?.employeeId],
    mutationFn(employeeId) {
      return deleteEmployee(employeeId);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      if (toast.current) {
        (toast.current as Toast).show({
          severity: 'success',
          summary: 'Success',
          detail: 'Employee Successfully Deleted',
          life: 3000,
        });
      }
    },
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const loadEmployee = useCallback((_employee: Employee) => {
    setEmployee(_employee);
    setIsModalOpen(true);
  }, []);

  const _deleteEmployee = useCallback(
    (employeeId: string) => {
      mutate(employeeId);
    },
    [mutate],
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setEmployee(undefined);
    queryClient.invalidateQueries({ queryKey: ['employees'] });
  };

  const body = useCallback(
    (employee: Employee, options: ColumnBodyOptions) => {
      if (options.field === 'edit') {
        return (
          <>
            <span className="flex gap-1 items-center">
              <Link
                to={`/${employee.employeeId}`}
                className="p-ripple p-element p-button p-component p-button-link p-button-sm"
              >
                View
              </Link>
              <Button onClick={() => loadEmployee(employee)} text size="small">
                Edit
              </Button>
              <Button
                onClick={() => _deleteEmployee(employee.employeeId)}
                text
                severity="danger"
                size="small"
              >
                Delete
              </Button>
            </span>
          </>
        );
      }
      return <>{employee[options.field as keyof Employee]}</>;
    },
    [loadEmployee, _deleteEmployee],
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-2xl"></h4>
        <Button onClick={openModal} rounded size="small" type="button">
          Add Employee
        </Button>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {employees && (
          <DataTable value={employees} header="Manage Employees">
            {columns.map((column) => {
              return (
                <Column
                  key={column.header}
                  body={body}
                  field={column.field || 'edit'}
                  header={
                    column.header === 'EDIT' ? (
                      <Header header={column.header} />
                    ) : (
                      column.header
                    )
                  }
                />
              );
            })}
          </DataTable>
        )}
      </div>
      <Dialog
        blockScroll
        header="Employee Details"
        closeOnEscape={false}
        modal
        visible={isModalOpen}
        style={{ width: '30vw' }}
        onHide={closeModal}
        dismissableMask={false}
        draggable={false}
      >
        <EmployeeForm
          toast={toast as unknown as MutableRefObject<Toast>}
          key={String(isModalOpen)}
          employee={employee}
          onCloseModal={closeModal}
        />
      </Dialog>
      <Toast ref={toast} />
    </>
  );
};
