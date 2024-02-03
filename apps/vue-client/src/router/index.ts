import EmployeeDetailsVue from '@/features/employees/EmployeeDetails.vue';
import EmployeesVue from '@/features/employees/Employees.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'employees',
      component: EmployeesVue,
    },
    {
      path: '/:employeeId',
      name: 'employeeDetails',
      component: EmployeeDetailsVue,
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
});

export default router;
