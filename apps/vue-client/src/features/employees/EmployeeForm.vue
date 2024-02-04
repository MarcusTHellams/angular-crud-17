<template>
  <form @submit="submitHandler" novalidate>
    <div class="mb-5">
      <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Name</label
      >
      <InputText v-model="name" v-bind="nameAttrs" type="text" id="name" class="w-full" />
      <p class="text-red-600 mt-1" v-if="errors.name">
        {{ errors.name }}
      </p>
    </div>
    <div class="mb-5">
      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Email</label
      >
      <InputText v-model="email" v-bind="emailAttrs" type="text" id="email" class="w-full" />
      <p class="text-red-600 mt-1" v-if="errors.email">
        {{ errors.email }}
      </p>
    </div>
    <div class="mb-5">
      <label for="mobile" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Mobile</label
      >
      <InputText v-model="mobile" v-bind="mobileAttrs" type="text" id="mobile" class="w-full" />
      <p class="text-red-600 mt-1" v-if="errors.mobile">
        {{ errors.mobile }}
      </p>
    </div>
    <div class="mb-5">
      <label for="dob" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Date of Birth</label
      >
      <Calendar
        show-button-bar
        append-to="body"
        class="w-full"
        v-bind="dobAttrs"
        @update:model-value="dob = formatOutBoundDate($event)"
        :model-value="formatInboundDate(dob)"
      />
      <p class="text-red-600 mt-1" v-if="errors.dob">
        {{ errors.dob }}
      </p>
    </div>
    <div class="mb-5">
      <label for="doj" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Date Joined</label
      >
      <Calendar
        show-button-bar
        append-to="body"
        class="w-full"
        v-bind="dojAttrs"
        @update:model-value="doj = formatOutBoundDate($event)"
        :model-value="formatInboundDate(doj)"
      />
      <p class="text-red-600 mt-1" v-if="errors.doj">
        {{ errors.doj }}
      </p>
    </div>
    <div class="flex gap-1">
      <Button :disabled="!meta.valid" type="submit">Submit</Button>
      <Button severity="secondary" @click="$emit('onCloseModal')" type="button">Cancel</Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { format } from 'date-fns';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import { useForm } from 'vee-validate';
import { date, object, string } from 'yup';
import { createEmployee, updateEmployee, type Employee } from 'crud-utils';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const { employee } = defineProps<{
  employee?: Employee;
}>();

const emit = defineEmits<{
  onCloseModal: [];
}>();

const { defineField, handleSubmit, errors, meta } = useForm<Employee>({
  initialValues: { ...employee },
  validationSchema: object({
    name: string().required(),
    email: string().required().email(),
    mobile: string().required(),
    dob: date().required(),
    doj: date().required(),
  }),
});

const [name, nameAttrs] = defineField('name');
const [email, emailAttrs] = defineField('email');
const [mobile, mobileAttrs] = defineField('mobile');
const [dob, dobAttrs] = defineField('dob');
const [doj, dojAttrs] = defineField('doj');

const { mutate: createMutation } = useMutation<Employee, Error, Omit<Employee, 'employeeId'>>({
  mutationKey: ['createEmployee'],
  mutationFn(employee) {
    return createEmployee(employee);
  },
  onSuccess() {
    showSuccessfulToast('Employee Successfully Created');
    onClose();
  },
});

const { mutate: updateMutation } = useMutation<Employee, Error, Partial<Employee>>({
  mutationKey: ['createEmployee'],
  mutationFn(employee) {
    return updateEmployee(employee.employeeId!, employee);
  },
  onSuccess() {
    showSuccessfulToast('Employee Successfully Updated');
    onClose();
  },
});

const formatInboundDate = (inboundDate?: string) => {
  if (inboundDate) {
    return new Date(inboundDate);
  }
  return '';
};
const formatOutBoundDate = (outboundDate: Date) => {
  if (outboundDate) {
    return format(new Date(outboundDate), 'LL-dd-yyyy');
  }
  return '';
};

const submitHandler = handleSubmit((values) => {
  if (employee) {
    updateMutation(values);
    return;
  }
  createMutation(values);
});

function onClose() {
  emit('onCloseModal');
}

function showSuccessfulToast(detail: string) {
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: detail,
    life: 3000,
  });
}
</script>
