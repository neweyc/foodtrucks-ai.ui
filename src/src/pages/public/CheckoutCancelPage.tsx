import { useNavigate } from 'react-router-dom';
import { Typography, Button, Container, Paper } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export default function CheckoutCancelPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 5, textAlign: 'center', borderRadius: 4 }}>
        <CancelOutlinedIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>Payment Cancelled</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
            You have cancelled the checkout process. No charges were made.
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>Return to Menu</Button>
      </Paper>
    </Container>
  );
}
