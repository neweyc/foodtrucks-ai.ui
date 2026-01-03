import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  CardMedia,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EditIcon from '@mui/icons-material/Edit';
import { getMe, getTrucks } from '../../api/client';
import type { Truck } from '../../api/client';

export default function TrucksPage() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getMe();
        if (user.vendorId) {
          const data = await getTrucks(user.vendorId);
          setTrucks(data);
        } else {
          setTrucks([]); // Not a vendor or no trucks yet
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to load trucks.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
      </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>My Trucks</Typography>
            <Typography variant="body1" color="text.secondary">Manage your fleet and menus</Typography>
        </Box>
        <Button 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<AddIcon />} 
            onClick={() => navigate('/vendor/trucks/new')}
            sx={{ px: 4 }}
        >
          Add Truck
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {trucks.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>No trucks found</Typography>
            <Typography sx={{ mb: 3 }}>Get started by adding your first food truck!</Typography>
            <Button variant="outlined" onClick={() => navigate('/vendor/trucks/new')}>Add Truck</Button>
        </Box>
      )}

      <Grid container spacing={4}>
        {trucks.map((truck) => (
          <Grid size={{ xs: 12}} key={truck.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://images.unsplash.com/photo-1565123409695-7b5ef63a74ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" 
                alt="Food Truck"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                    {truck.name}
                    </Typography>
                    <Chip label="Active" color="success" size="small" variant="outlined" />
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {truck.description || "No description provided."}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                <Button 
                    startIcon={<EditIcon />} 
                    color="inherit" 
                    size="small"
                    onClick={() => navigate(`/vendor/trucks/${truck.id}/edit`)}
                >
                    Edit
                </Button>
                <Button 
                    variant="contained" 
                    color="secondary"
                    startIcon={<RestaurantMenuIcon />} 
                    onClick={() => navigate(`/vendor/trucks/${truck.id}/menu`)}
                >
                  Manage Menu
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
