<template>
  <div v-if="employee" class="h-[100vh] flex items-center justify-center">
    <div class="w-[40vw]">
      <Card>
        <template #title>{{ employee.name }}</template>
        <template #content>
          <dl class="grid grid-cols-4 m-0">
            <dt class="col-span-4 sm:col-span-1 font-extrabold">Email:</dt>
            <dd class="col-span-4 sm:col-span-3 ml-0 mb-2">
              {{ employee.email }}
            </dd>
            <dt class="col-span-4 sm:col-span-1 font-extrabold">Mobile:</dt>
            <dd class="col-span-4 sm:col-span-3 ml-0 mb-2">
              {{ employee.mobile }}
            </dd>
            <dt class="col-span-4 sm:col-span-1 font-extrabold">Date of Birth:</dt>
            <dd class="col-span-4 sm:col-span-3 ml-0 mb-2">
              {{ employee.dob }}
            </dd>
            <dt class="col-span-4 sm:col-span-1 font-extrabold">Date Joined:</dt>
            <dd class="col-span-4 sm:col-span-3 ml-0 mb-2">
              {{ employee.doj }}
            </dd>
          </dl>
        </template>
        <template #footer>
          <RouterLink
            to="/"
            class="p-ripple p-element p-button p-component p-button-sm no-underline"
            >Back</RouterLink
          >
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { useRoute, RouterLink } from 'vue-router';
import { getEmployee } from 'crud-utils';

import Card from 'primevue/card';

const route = useRoute();
const employeeId = route.params['employeeId'];
const { data: employee } = useQuery({
  get queryKey() {
    return ['employee', employeeId];
  },
  queryFn() {
    return getEmployee(employeeId as string);
  },
});
</script>
