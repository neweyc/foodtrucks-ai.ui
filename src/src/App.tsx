import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VendorLayout from './layouts/VendorLayout';
import VendorDashboard from './pages/vendor/VendorDashboard';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import VendorsPage from './pages/admin/Vendors/VendorsPage';

import LoginPage from './pages/LoginPage';

import TrucksPage from './pages/vendor/TrucksPage';
import CreateTruckPage from './pages/vendor/CreateTruckPage';
import EditTruckPage from './pages/vendor/EditTruckPage';
import TruckMenuPage from './pages/vendor/TruckMenuPage';
import VendorOrdersPage from './pages/vendor/VendorOrdersPage';
import ProfilePage from './pages/vendor/ProfilePage';
import CustomerTruckPage from './pages/public/CustomerTruckPage';
import OrderTrackingPage from './pages/public/OrderTrackingPage';
import CheckoutSuccessPage from './pages/public/CheckoutSuccessPage';
import CheckoutCancelPage from './pages/public/CheckoutCancelPage';
import HomePage from './pages/public/HomePage';

import AdminProfilePage from './pages/admin/AdminProfilePage';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            {/* Public Routes */}
            <Route path="/trucks/:truckId" element={<CustomerTruckPage />} />
            <Route path="/order/:trackingCode" element={<OrderTrackingPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />

            <Route path="/" element={<HomePage />} />

            {/* Vendor Routes - Protected */}
            <Route path="/vendor" element={<ProtectedRoute requireVendor><VendorLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<VendorDashboard />} />
              <Route path="trucks" element={<TrucksPage />} />
              <Route path="trucks/new" element={<CreateTruckPage />} />
              <Route path="trucks/:truckId/edit" element={<EditTruckPage />} />
              <Route path="trucks/:truckId/menu" element={<TruckMenuPage />} />
              <Route path="orders" element={<VendorOrdersPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Routes - Protected */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="vendors" element={<VendorsPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
