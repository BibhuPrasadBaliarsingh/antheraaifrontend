import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { routes } from './routing/Routing';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={routes} />
      <Toaster position="top-right" />
    </AuthProvider>
  );
};

export default App;
