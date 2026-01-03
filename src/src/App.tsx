import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VendorLayout from './layouts/VendorLayout';
import VendorDashboard from './pages/vendor/VendorDashboard';

import LoginPage from './pages/LoginPage';

import TrucksPage from './pages/vendor/TrucksPage';
import CreateTruckPage from './pages/vendor/CreateTruckPage';
import EditTruckPage from './pages/vendor/EditTruckPage';
import TruckMenuPage from './pages/vendor/TruckMenuPage';
import VendorOrdersPage from './pages/vendor/VendorOrdersPage';
import CustomerTruckPage from './pages/public/CustomerTruckPage';
import OrderTrackingPage from './pages/public/OrderTrackingPage';
import HomePage from './pages/public/HomePage';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* Public Routes */}
          <Route path="/trucks/:truckId" element={<CustomerTruckPage />} />
          <Route path="/order/:trackingCode" element={<OrderTrackingPage />} />
          
          <Route path="/" element={<HomePage />} />
          
          {/* Vendor Routes */}
          <Route path="/vendor" element={<VendorLayout />}>
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="trucks" element={<TrucksPage />} />
            <Route path="trucks/new" element={<CreateTruckPage />} />
            <Route path="trucks/:truckId/edit" element={<EditTruckPage />} />
            <Route path="trucks/:truckId/menu" element={<TruckMenuPage />} />
            <Route path="orders" element={<VendorOrdersPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
