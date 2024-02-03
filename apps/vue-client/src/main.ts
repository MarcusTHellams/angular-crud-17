import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import ToastService from 'primevue/toastservice';


import './assets/main.css';
import PrimeVue from 'primevue/config';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

//in main.js
import 'primevue/resources/themes/lara-light-blue/theme.css';

const app = createApp(App);

app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(VueQueryPlugin, {
  queryClient: new QueryClient({
    defaultOptions: {
      queries: {
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  }),
});

app.mount('#app');
