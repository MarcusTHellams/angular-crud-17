import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getEmployee } from 'crud-utils';
import { Card } from 'primereact/card';

export const EmployeeDetails = () => {
  const { employeeId } = useParams() as { employeeId: string };

  const { data: employee } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn() {
      return getEmployee(employeeId);
    },
  });

  return (
    <>
      {employee && (
        <div className="h-[100vh] flex items-center justify-center">
          <div className="w-[40vw]">
            <Card
              title={employee.name}
              footer={
                <Link
                  to="/"
                  className="p-ripple p-element p-button p-component p-button-sm no-underline"
                >
                  Back
                </Link>
              }
            >
              <dl className="grid grid-cols-4 m-0">
                <dt className="col-span-4 sm:col-span-1 font-extrabold">
                  Email:
                </dt>
                <dd className="col-span-4 sm:col-span-3 ml-0 mb-2">
                  {employee.email}
                </dd>
                <dt className="col-span-4 sm:col-span-1 font-extrabold">
                  Mobile:
                </dt>
                <dd className="col-span-4 sm:col-span-3 ml-0 mb-2">
                  {employee.mobile}
                </dd>
                <dt className="col-span-4 sm:col-span-1 font-extrabold">
                  Date of Birth:
                </dt>
                <dd className="col-span-4 sm:col-span-3 ml-0 mb-2">
                  {employee.dob}
                </dd>
                <dt className="col-span-4 sm:col-span-1 font-extrabold">
                  Date Joined:
                </dt>
                <dd className="col-span-4 sm:col-span-3 ml-0 mb-2">
                  {employee.doj}
                </dd>
              </dl>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};
