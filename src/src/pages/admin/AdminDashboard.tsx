import { Typography, Paper, Box } from '@mui/material';

export default function AdminDashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Welcome to the Admin Portal.
        </Typography>
      </Paper>
    </Box>
  );
}
