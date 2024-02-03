import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useForm, Controller } from 'react-hook-form';
import { object, string, InferType } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Employee } from '../../common/employee.type';
import { format } from 'date-fns';

import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { MutableRefObject } from 'react';
import { Toast } from 'primereact/toast';
import { useMutation } from '@tanstack/react-query';
import { createEmployee, updateEmployee } from './employee.service';

const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

const dateSchema = string().required().matches(dateRegex);

const schema = object({
  name: string().required(),
  email: string().required().email(),
  mobile: string().required(),
  dob: dateSchema,
  doj: dateSchema,
});

type FieldValues = InferType<typeof schema>;

type EmployeeFormProps = {
  employee?: Employee;
  onCloseModal: () => void;
  toast: MutableRefObject<Toast>;
};

export const EmployeeForm = ({
  employee,
  onCloseModal,
  toast,
}: EmployeeFormProps) => {
  const {
    register,
    control,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<FieldValues>({
    defaultValues: employee,
    resolver: yupResolver(schema),
    shouldUnregister: true,
  });

  const { mutate: createMutate } = useMutation<Employee, Error, FieldValues>({
    mutationKey: ['createEmployee'],
    mutationFn(employee) {
      return createEmployee(employee);
    },
    onSuccess() {
      showSuccessfulToast('Employee Successfully Created');
      onCloseModal();
    },
  });

  const { mutate: updateMutate } = useMutation<Employee, Error, FieldValues>({
    mutationKey: ['updateEmployee', employee?.employeeId],
    mutationFn(_employee) {
      return updateEmployee(employee!.employeeId, _employee);
    },
    onSuccess() {
      showSuccessfulToast('Employee Successfully Updated');
      onCloseModal();
    },
  });

  const submitHandler = handleSubmit((values) => {
    if (employee) {
      updateMutate(values);
      return;
    }
    createMutate(values);
  });
  const formatOutBoundDate = (outboundDate: Nullable<Date>) => {
    if (outboundDate) {
      return format(new Date(outboundDate), 'LL-dd-yyyy');
    }
    return '';
  };
  const formatInboundDate = (inboundDate?: string) => {
    if (inboundDate) {
      return new Date(inboundDate);
    }
    return null;
  };
  function showSuccessfulToast(detail: string) {
    toast.current.show({
      severity: 'success',
      summary: 'Success',
      detail: detail,
      life: 3000,
    });
  }

  return (
    <>
      <form onSubmit={submitHandler}>
        <div className="mb-5">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <InputText
            {...register('name')}
            type="text"
            id="name"
            className={`w-full ${errors.name ? 'p-invalid' : ''}`}
          />
          {errors.name && (
            <p className="text-red-600 mt-1">{errors.name?.message}</p>
          )}
        </div>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <InputText
            {...register('email')}
            type="email"
            id="email"
            className={`w-full ${errors.email ? 'p-invalid' : ''}`}
          />
          {errors.email && (
            <p className="text-red-600 mt-1">{errors.email?.message}</p>
          )}
        </div>
        <div className="mb-5">
          <label
            htmlFor="mobile"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Mobile
          </label>

          <InputText
            {...register('mobile')}
            type="mobile"
            id="mobile"
            className={`w-full ${errors.mobile ? 'p-invalid' : ''}`}
          />
          {errors.mobile && (
            <p className="text-red-600 mt-1">{errors.mobile?.message}</p>
          )}
        </div>
        <div className="mb-5">
          <label
            htmlFor="dob"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Date of Birth
          </label>
          <Controller
            name="dob"
            {...{ control }}
            render={({ field: { name, onChange, value, onBlur } }) => {
              return (
                <>
                  <Calendar
                    showButtonBar
                    className={`w-full ${errors.dob ? 'p-invalid' : ''}`}
                    {...{ name, onBlur }}
                    value={formatInboundDate(value)}
                    onChange={({ value }) => {
                      onChange(formatOutBoundDate(value));
                    }}
                  />
                </>
              );
            }}
          />
          {errors.dob && (
            <p className="text-red-600 mt-1">{errors.dob?.message}</p>
          )}
        </div>
        <div className="mb-5">
          <label
            htmlFor="doj"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Date Joined
          </label>
          <Controller
            name="doj"
            {...{ control }}
            render={({ field: { name, onChange, value, onBlur } }) => {
              return (
                <>
                  <Calendar
                    showButtonBar
                    className={`w-full ${errors.dob ? 'p-invalid' : ''}`}
                    {...{ name, onBlur }}
                    value={formatInboundDate(value)}
                    onChange={({ value }) => {
                      onChange(formatOutBoundDate(value));
                    }}
                  />
                </>
              );
            }}
          />
          {errors.doj && (
            <p className="text-red-600 mt-1">{errors.doj?.message}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button disabled={!isValid} type="submit">
            Submit
          </Button>
          <Button onClick={onCloseModal} severity="secondary" type="button">
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
};
