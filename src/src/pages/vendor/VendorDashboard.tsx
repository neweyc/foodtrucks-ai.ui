import { Typography, Grid, Paper, Box } from '@mui/material';

export default function VendorDashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Vendor Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Recent Orders
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              No orders yet.
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Active Trucks
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              Loading trucks...
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
