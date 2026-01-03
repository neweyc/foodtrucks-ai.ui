import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface Truck {
    id: number;
    name: string;
    description: string;
    photoUrl: string;
    schedule: string;
}

const Home: React.FC = () => {
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/trucks')
            .then(res => res.json())
            .then(data => {
                setTrucks(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Container>
            <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                Find Food Trucks Near You
            </Typography>
            <Grid container spacing={4}>
                {trucks.map((truck) => (
                    <Grid key={truck.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="div"
                                sx={{
                                    height: 140,
                                    bgcolor: 'primary.light', // Placeholder color
                                }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {truck.name}
                                </Typography>
                                <Typography>
                                    {truck.description}
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                    {truck.schedule}
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 2 }}>
                                <Button size="small" variant="contained" component={RouterLink} to={`/trucks/${truck.id}`}>
                                    View Menu
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Home;
