<template>
  <div class="flex justify-between items-center mb-6">
    <h4 class="font-bold text-2xl"></h4>
    <Button :rounded="true" size="small" type="button" @click="openModal()"> Add Employee </Button>
  </div>

  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <DataTable v-if="employees" :value="employees" header="Manage Employees">
      <template #header>
        <div class="table-header">Manage Employees</div>
      </template>
      <Column v-for="col in columns" :key="col.header" :field="col.field">
        <template #header>
          <template v-if="col.header === 'EDIT'">
            <span class="sr-only">{{ col.header }}</span>
          </template>
          <template v-else>
            {{ col.header }}
          </template>
        </template>
        <template #body="slotProps">
          <template v-if="col.header === 'EDIT'">
            <span class="flex gap-1 items-center">
              <RouterLink
                class="p-ripple p-element p-button p-component p-button-link p-button-sm"
                :to="`/${slotProps.data.employeeId}`"
              >
                View
              </RouterLink>
              <Button @click="loadEmployee(slotProps.data)" :text="true" size="small">Edit</Button>
              <Button
                @click="deleteEmployee(slotProps.data.employeeId)"
                :text="true"
                severity="danger"
                size="small"
                >Delete</Button
              >
            </span>
          </template>
          <template v-else>
            {{ slotProps.data[col.field] }}
          </template>
        </template>
      </Column>
    </DataTable>
  </div>
  <Dialog
    :close-on-escape="false"
    @after-hide="closeModal"
    v-model:visible="isModalOpen"
    modal
    append-to="body"
    header="Employee Details"
    :style="{ width: '30vw' }"
  >
    <EmployeeForm :employee="employee" @on-close-modal="closeModal" />
  </Dialog>
  <Toast />
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { getAllEmployees, deleteEmployee as _deleteEmployee } from 'crud-utils';
import { type Employee } from 'crud-utils';
import EmployeeForm from '@/features/employees/EmployeeForm.vue';
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

import Dialog from 'primevue/dialog';

import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const toast = useToast();

const isModalOpen = ref(false);
const employee = ref<Employee | undefined>(undefined);
const queryClient = useQueryClient();

const { data: employees } = useQuery({
  queryKey: ['employees'],
  async queryFn() {
    return getAllEmployees();
  },
});

const { mutate } = useMutation<Employee, Error, string>({
  get mutationKey() {
    return ['delete', employee.value?.employeeId];
  },
  mutationFn(employeeId) {
    return _deleteEmployee(employeeId);
  },
  onSuccess() {
    queryClient.invalidateQueries({ queryKey: ['employees'] });
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Employee Successfully Deleted',
      life: 3000,
    });
  },
});

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

const openModal = () => {
  isModalOpen.value = true;
};
const loadEmployee = (_employee: Employee) => {
  employee.value = _employee;
  isModalOpen.value = true;
};
const deleteEmployee = (employeeId: string) => {
  mutate(employeeId);
};

const closeModal = () => {
  isModalOpen.value = false;
  employee.value = undefined;
  queryClient.invalidateQueries({ queryKey: ['employees'] });
};
</script>
