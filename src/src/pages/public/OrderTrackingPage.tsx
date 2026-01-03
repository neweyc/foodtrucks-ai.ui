import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Container, Paper, CircularProgress, Alert, Stepper, Step, StepLabel, Button } from '@mui/material';
import { getOrder, type Order } from '../../api/client';

const steps = ['Pending', 'Paid', 'Cooking', 'Ready', 'Completed'];

export default function OrderTrackingPage() {
  const { trackingCode } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!trackingCode) return;

    const fetchOrder = () => {
        getOrder(trackingCode)
        .then(setOrder)
        .catch(err => {
            console.error(err);
            setError('Order not found.');
        })
        .finally(() => setLoading(false));
    };

    fetchOrder();
    // Poll every 10 seconds
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);

  }, [trackingCode]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
    </Box>
  );

  if (error || !order) return (
     <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert severity="error">{error || 'Order not found'}</Alert>
     </Container>
  );

  const activeStep = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 0;

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Order #{order.id}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Total: ${order.totalAmount.toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                   Tracking Code: {trackingCode}
                </Typography>
            </Box>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2, mb: 4 }}>
                 <Typography variant="h6" gutterBottom>Itmes</Typography>
                 {order.items.map((item, index) => (
                     <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                         <Typography>
                             <b>{item.quantity}x</b> {item.itemName}
                         </Typography>
                         <Typography>
                             ${(item.price * item.quantity).toFixed(2)}
                         </Typography>
                     </Box>
                 ))}
            </Box>

            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Thanks for your order, <b>{order.customerName}</b>!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    You will receive a text at {order.customerPhone} when it's ready.
                </Typography>
            </Box>
            
            {order.status === 'Completed' && (
                 <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button variant="contained" component={Link} to={`/trucks/${order.id}`}> {/* Warning: TruckId is not directly on Order DTO in client yet, assuming it might be needed or just back to home */}
                        Order Again
                    </Button>
                 </Box>
            )}
        </Paper>
    </Container>
  );
}
