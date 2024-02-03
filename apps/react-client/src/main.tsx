import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import App from './App.tsx';

import { PrimeReactProvider } from 'primereact/api';

import './index.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';

const client = new QueryClient({
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
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>
    </PrimeReactProvider>
  </React.StrictMode>,
);
