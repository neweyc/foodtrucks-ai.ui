import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireVendor?: boolean;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireVendor, requireAdmin }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireVendor && (user.vendorId === undefined || user.vendorId === null)) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.vendorId !== undefined && user.vendorId !== null) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
