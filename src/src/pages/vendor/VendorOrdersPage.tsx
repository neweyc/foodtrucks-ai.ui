import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  FormControl, InputLabel, Select, MenuItem, Chip, CircularProgress, Alert,
  Container, Grid, Card, CardContent
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { getMe, getTrucks, getOrders } from '../../api/client';
import type { Truck, Order } from '../../api/client';

export default function VendorOrdersPage() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [selectedTruckId, setSelectedTruckId] = useState<number | ''>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch Trucks on Mount
  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const user = await getMe();
        if (user.vendorId) {
          const data = await getTrucks(user.vendorId);
          setTrucks(data);
          if (data.length > 0) {
            setSelectedTruckId(data[0].id); // Auto-select first truck
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load trucks.');
      }
    };
    fetchTrucks();
  }, []);

  // 2. Fetch Orders when Truck Selected
  useEffect(() => {
    if (!selectedTruckId) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
         const data = await getOrders(selectedTruckId as number);
         setOrders(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [selectedTruckId]);

  const handleTruckChange = (event: SelectChangeEvent<number>) => {
    setSelectedTruckId(event.target.value as number);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'success'; // Green for paid/new
      case 'Completed': return 'default';
      case 'Cancelled': return 'error';
      default: return 'warning';
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <ReceiptLongIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box>
            <Typography variant="h4" fontWeight="bold">Incoming Orders</Typography>
            <Typography color="text.secondary">Real-time order feed for your kitchen.</Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Filter by Truck</Typography>
                    <FormControl fullWidth size="small">
                    <InputLabel>Select Truck</InputLabel>
                    <Select
                        value={selectedTruckId}
                        label="Select Truck"
                        onChange={handleTruckChange}
                    >
                        {trucks.map((truck) => (
                        <MenuItem key={truck.id} value={truck.id}>{truck.name}</MenuItem>
                        ))}
                    </Select>
                    </FormControl>
                </CardContent>
            </Card>
            
            {/* Summary Widget */}
            <Card>
                <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">Today's Total</Typography>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                        ${orders.reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{orders.length} orders</Typography>
                </CardContent>
            </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            <Paper sx={{ overflow: 'hidden' }}>
                {loading ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
                ) : orders.length === 0 ? (
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                        <Typography color="text.secondary">No orders found for this truck.</Typography>
                    </Box>
                ) : (
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id} hover>
                        <TableCell>
                            <Typography variant="body2" fontWeight="bold">#{order.id}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2" fontWeight="medium">{order.customerName}</Typography>
                            <Typography variant="caption" color="text.secondary">{order.customerPhone}</Typography>
                        </TableCell>
                        <TableCell>
                            {order.items.map((item, idx) => (
                                <Box key={idx} sx={{ display: 'flex', gap: 1 }}>
                                    <Typography variant="body2" fontWeight="bold">{item.quantity}x</Typography>
                                    <Typography variant="body2">{item.itemName}</Typography>
                                </Box>
                            ))}
                        </TableCell>
                        <TableCell variant="head" sx={{ color: 'primary.main' }}>${order.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                            <Chip 
                                label={order.status} 
                                color={getStatusColor(order.status) as any} 
                                size="small" 
                                variant="filled"
                                sx={{ fontWeight: 'bold' }}
                            />
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</TableCell>
                        <TableCell align="right">
                             {/* Placeholder for future status actions */}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                )}
            </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
