import { RouterProvider } from 'react-router-dom';

import { router } from './common/routes.tsx';

function App() {
  return (
    <div className="container mt-8">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
