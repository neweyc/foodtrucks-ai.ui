import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Box, Typography, Container, Grid, Card, CardContent, CardActions, 
    Button, AppBar, Toolbar, CircularProgress, Alert, Chip 
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { getTrucks, type Truck } from '../../api/client';

export default function HomePage() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getTrucks()
      .then(setTrucks)
      .catch(err => {
        console.error(err);
        setError('Failed to load food trucks.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Navbar */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
            <Toolbar disableGutters>
                <LocalDiningIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
                <Typography
                    variant="h6"
                    noWrap
                    component={Link}
                    to="/"
                    sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontWeight: 700,
                    letterSpacing: '.1rem',
                    color: 'inherit',
                    textDecoration: 'none',
                    flexGrow: 1
                    }}
                >
                    FOODTRUCKS
                </Typography>

                <Button component={Link} to="/login" variant="outlined" startIcon={<StorefrontIcon />}>
                    Vendor Login
                </Button>
            </Toolbar>
        </Container>
      </AppBar>

      {/* Hero */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, mb: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography variant="h2" fontWeight="800" gutterBottom>
                Find Your Next Meal
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9 }}>
                Discover the best local food trucks in your area.
            </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
            <Grid container spacing={4}>
                {trucks.map(truck => (
                    <Grid key={truck.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card 
                            sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                borderRadius: 4,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}
                        >
                            <Box 
                                sx={{ 
                                    height: 160, 
                                    bgcolor: 'secondary.light', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}
                            >
                                <LocalDiningIcon sx={{ fontSize: 60, color: 'white', opacity: 0.5 }} />
                            </Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h5" component="div" fontWeight="bold" gutterBottom>
                                    {truck.name}
                                </Typography>
                                <Chip label={truck.schedule || "Various Times"} size="small" sx={{ mb: 2 }} />
                                <Typography variant="body2" color="text.secondary">
                                    {truck.description}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0 }}>
                                <Button 
                                    component={Link} 
                                    to={`/trucks/${truck.id}`} 
                                    variant="contained" 
                                    fullWidth
                                    sx={{ borderRadius: 2 }}
                                >
                                    View Menu
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        )}
      </Container>
    </Box>
  );
}
