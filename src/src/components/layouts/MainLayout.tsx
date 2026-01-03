import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Outlet, Link as RouterLink } from 'react-router-dom';

const MainLayout: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                        FoodTrucks
                    </Typography>
                    <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                    <Button color="inherit" component={RouterLink} to="/register">Register</Button>
                </Toolbar>
            </AppBar>
            <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
                <Outlet />
            </Container>
            <Box component="footer" sx={{ py: 3, textAlign: 'center', bgcolor: 'grey.200' }}>
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} FoodTrucks App
                </Typography>
            </Box>
        </Box>
    );
};

export default MainLayout;
