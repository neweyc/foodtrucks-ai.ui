import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyCheckout } from '../../api/client';
import { Box, Typography, Button, CircularProgress, Container, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderInfo, setOrderInfo] = useState<{orderId: number, trackingCode: string} | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found.');
      setLoading(false);
      return;
    }

    verifyCheckout({ sessionId })
      .then(data => {
        setOrderInfo(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to verify payment. Please contact support if you believe this is an error.');
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>Verifying your payment...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
            <Typography variant="h5" color="error" gutterBottom>Payment Verification Failed</Typography>
            <Typography color="text.secondary" paragraph>{error}</Typography>
            <Button variant="contained" onClick={() => navigate('/')}>Return Home</Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 5, textAlign: 'center', borderRadius: 4 }}>
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>Payment Successful!</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
            Thank you for your order. We have received your payment and the vendor will start preparing your food shortly.
        </Typography>
        
        {orderInfo && (
             <Box sx={{ my: 4, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">ORDER NUMBER</Typography>
                <Typography variant="h5" fontWeight="black">#{orderInfo.orderId}</Typography>
             </Box>
        )}

        <Button 
            variant="contained" 
            size="large" 
            fullWidth 
            onClick={() => navigate(`/order/${orderInfo?.trackingCode}`)}
            sx={{ borderRadius: 2 }}
        >
            Track Order Status
        </Button>
      </Paper>
    </Container>
  );
}
