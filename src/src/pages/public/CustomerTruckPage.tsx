import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, CardActions, Button, Grid,
  Container, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, Paper, Zoom, Radio, RadioGroup, FormControlLabel, 
  FormControl, FormLabel, Checkbox, FormGroup, IconButton
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getTruck, placeOrder } from '../../api/client';
import type { Truck, MenuItem } from '../../api/client';

// Cart Interface
interface CartItem {
  key: string;
  menuItem: MenuItem;
  quantity: number;
  selectedSize?: { id: number, name: string, price: number };
  selectedOptions?: { id: number, name: string, price: number }[];
}

export default function CustomerTruckPage() {
  const navigate = useNavigate();
  const { truckId } = useParams();
  const [truck, setTruck] = useState<Truck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Customization Dialog State
  const [isCustomizeOpen, setCustomizeOpen] = useState(false);
  const [tempItem, setTempItem] = useState<MenuItem | null>(null);
  const [tempSizeId, setTempSizeId] = useState<number | null>(null);
  const [tempOptionIds, setTempOptionIds] = useState<number[]>([]);

  // Checkout Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentToken, setPaymentToken] = useState('tok_visa'); // Mock token
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (!truckId) return;
    getTruck(parseInt(truckId))
      .then(setTruck)
      .catch(err => {
        console.error(err);
        setError('Truck not found.');
      })
      .finally(() => setLoading(false));
  }, [truckId]);

  const handleAddToCartClick = (item: MenuItem) => {
      const hasSizes = item.sizes && item.sizes.length > 0;
      const hasOptions = item.options && item.options.length > 0;

      if (hasSizes || hasOptions) {
          // Open Customization
          setTempItem(item);
          setTempSizeId(hasSizes ? item.sizes![0].id : null);
          setTempOptionIds([]);
          setCustomizeOpen(true);
      } else {
          // Add directly
          addToCart(item, 1);
      }
  };

  const confirmCustomization = () => {
        if (!tempItem) return;
        
        let sizeObj = undefined;
        if(tempSizeId && tempItem.sizes) {
            sizeObj = tempItem.sizes.find(s => s.id === tempSizeId);
        }

        let optionObjs: {id: number, name: string, price: number}[] = [];
        if(tempOptionIds.length > 0 && tempItem.options) {
            optionObjs = tempItem.options.filter(o => tempOptionIds.includes(o.id));
        }

        addToCart(tempItem, 1, sizeObj, optionObjs);
        setCustomizeOpen(false);
  };

  const addToCart = (
      item: MenuItem, 
      quantity: number, 
      size?: { id: number, name: string, price: number },
      options?: { id: number, name: string, price: number }[]
    ) => {
    
    // Generate Key
    const optionKey = options?.map(o => o.id).sort().join(',') || '';
    const key = `${item.id}-${size?.id || ''}-${optionKey}`;

    setCartItems(prev => {
        const existingIndex = prev.findIndex(i => i.key === key);
        if (existingIndex >= 0) {
            const newCart = [...prev];
            newCart[existingIndex].quantity += quantity;
            return newCart;
        } else {
            return [...prev, {
                key,
                menuItem: item,
                quantity,
                selectedSize: size,
                selectedOptions: options
            }];
        }
    });
  };

  const handleRemoveFromCart = (key: string) => {
    setCartItems(prev => prev.filter(item => item.key !== key));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
        let price = item.selectedSize ? item.selectedSize.price : item.menuItem.price;
        if (item.selectedOptions) {
            price += item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
        }
        return total + (price * item.quantity);
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (!truck || !customerName || !customerPhone || !paymentToken) return;
    
    try {
        const items = cartItems.map(i => ({
            menuItemId: i.menuItem.id,
            quantity: i.quantity,
            sizeId: i.selectedSize?.id,
            optionIds: i.selectedOptions?.map(o => o.id)
        }));

        const result = await placeOrder({
            truckId: truck.id,
            customerName,
            customerPhone,
            paymentToken,
            items
        });

        setOrderSuccess(true);
        setCartItems([]);
        setIsCheckoutOpen(false);
        navigate(`/order/${result.trackingCode}`);
    } catch (err) {
        console.error(err);
        alert('Failed to place order. Please try again.');
    }
  };

  if (loading) return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading delicious menu...</Typography>;
  if (error || !truck) return <Alert severity="error" sx={{ m: 4 }}>{error || 'Truck not found'}</Alert>;

  const cartTotalItems = cartItems.reduce((a, b) => a + b.quantity, 0);

  return (
    <Box sx={{ pb: 10 }}>
        {/* Hero Section */}
        <Box 
            sx={{ 
                bgcolor: 'secondary.main', 
                color: 'white', 
                py: 8, 
                px: 2,
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1565123409695-7b5ef63a74ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                mb: 6,
                textAlign: 'center'
            }}
        >
            <Container maxWidth="md">
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    color="inherit" 
                    onClick={() => navigate('/')}
                    sx={{ mb: 2, textTransform: 'none', fontWeight: 'bold' }}
                >
                    Back to Trucks
                </Button>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
                    {truck.name}
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9 }}>
                    {truck.description}
                </Typography>
            </Container>
        </Box>

      <Container maxWidth="lg">
        {orderSuccess && (
            <Alert severity="success" sx={{ mb: 4 }} onClose={() => setOrderSuccess(false)}>
                Order placed successfully! The vendor will be notified.
            </Alert>
        )}

        {truck.menuCategories?.map(category => (
          <Box key={category.id} sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mr: 2 }}>
                    {category.name}
                </Typography>
                <Divider sx={{ flexGrow: 1 }} />
              </Box>
              
              <Grid container spacing={4}>
                  {category.menuItems?.map(item => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                          <Card 
                            sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                borderRadius: 4,
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow: 'none',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    boxShadow: '0 8px 24px rgba(255, 76, 76, 0.15)',
                                    transform: 'translateY(-4px)'
                                }
                            }}
                          >
                              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="h6" fontWeight="bold">{item.name}</Typography>
                                      <Typography variant="h6" color="primary" fontWeight="bold">
                                          ${item.price.toFixed(2)}
                                          {item.sizes && item.sizes.length > 0 && "+"}
                                      </Typography>
                                  </Box>
                                  <Typography variant="body2" color="text.secondary">
                                      {item.description}
                                  </Typography>
                                  {item.sizes && item.sizes.length > 0 && (
                                      <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                                          Maybe multiple sizes available
                                      </Typography>
                                  )}
                              </CardContent>
                              <CardActions sx={{ p: 2, pt: 0 }}>
                                  <Button 
                                    fullWidth 
                                    variant="outlined" 
                                    startIcon={<AddIcon />}
                                    onClick={() => handleAddToCartClick(item)}
                                    sx={{ borderRadius: 2 }}
                                  >
                                      Add to Order
                                  </Button>
                              </CardActions>
                          </Card>
                      </Grid>
                  ))}
              </Grid>
          </Box>
        ))}
      </Container>

      {/* Floating Checkout Button */}
      <Zoom in={cartTotalItems > 0}>
        <Paper
            elevation={4}
            sx={{
                position: 'fixed',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                borderRadius: 50,
                overflow: 'hidden'
            }}
        >
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => setIsCheckoutOpen(true)}
                sx={{ 
                    px: 4, 
                    py: 1.5, 
                    fontSize: '1.1rem',
                    borderRadius: 0 
                }}
                startIcon={<ShoppingCartIcon />}
            >
                Checkout • ${getTotalPrice().toFixed(2)}
            </Button>
        </Paper>
      </Zoom>

      {/* Customization Dialog */}
      <Dialog 
        open={isCustomizeOpen} 
        onClose={() => setCustomizeOpen(false)}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Customize {tempItem?.name}</DialogTitle>
        <DialogContent dividers>
            {tempItem?.sizes && tempItem.sizes.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <FormControl>
                        <FormLabel id="size-group-label" sx={{ mb: 1, fontWeight: 'bold' }}>Size</FormLabel>
                        <RadioGroup
                            aria-labelledby="size-group-label"
                            value={tempSizeId}
                            onChange={(e) => setTempSizeId(parseInt(e.target.value))}
                        >
                            {tempItem.sizes.map(size => (
                                <FormControlLabel 
                                    key={size.id} 
                                    value={size.id} 
                                    control={<Radio />} 
                                    label={`${size.name} ($${size.price.toFixed(2)})`} 
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Box>
            )}

            {tempItem?.options && tempItem.options.length > 0 && (
                <Box>
                    <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>Add-ons</FormLabel>
                    <FormGroup>
                        {tempItem.options.map(option => (
                            <FormControlLabel
                                key={option.id}
                                control={
                                    <Checkbox 
                                        checked={tempOptionIds.includes(option.id)} 
                                        onChange={(e) => {
                                            if(e.target.checked) {
                                                setTempOptionIds([...tempOptionIds, option.id]);
                                            } else {
                                                setTempOptionIds(tempOptionIds.filter(id => id !== option.id));
                                            }
                                        }}
                                    />
                                }
                                label={`${option.name} (+$${option.price.toFixed(2)})`}
                            />
                        ))}
                    </FormGroup>
                </Box>
            )}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setCustomizeOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={confirmCustomization}>Add to Order</Button>
        </DialogActions>
      </Dialog>


      {/* Checkout Dialog */}
      <Dialog 
        open={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" fontWeight="bold">Complete Your Order</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>ORDER SUMMARY</Typography>
                    {cartItems.map((item) => {
                         let price = item.selectedSize ? item.selectedSize.price : item.menuItem.price;
                         if (item.selectedOptions) {
                             price += item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
                         }
                         const totalItemPrice = price * item.quantity;
                        
                        return (
                            <Box key={item.key} sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body1">
                                            <Box component="span" sx={{ fontWeight: 'bold', mr: 1 }}>{item.quantity}x</Box> 
                                            {item.menuItem.name} 
                                            {item.selectedSize && ` (${item.selectedSize.name})`}
                                        </Typography>
                                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                + {item.selectedOptions.map(o => o.name).join(', ')}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography fontWeight="medium" sx={{ mr: 2 }}>${totalItemPrice.toFixed(2)}</Typography>
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleRemoveFromCart(item.key)}
                                            aria-label="remove item"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight="bold">Total</Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold">${getTotalPrice().toFixed(2)}</Typography>
                    </Box>
                </Paper>

                <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 1 }}>CONTACT DETAILS</Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField 
                                label="Your Name" 
                                fullWidth 
                                value={customerName} 
                                onChange={e => setCustomerName(e.target.value)} 
                                variant="outlined"
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField 
                                label="Phone Number" 
                                fullWidth 
                                value={customerPhone} 
                                onChange={e => setCustomerPhone(e.target.value)} 
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </Box>
                
                <Box>
                     <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 1 }}>PAYMENT</Typography>
                     <TextField 
                        label="Card Token" 
                        fullWidth 
                        value={paymentToken} 
                        onChange={e => setPaymentToken(e.target.value)} 
                        helperText={<span>Use <b>tok_visa</b> for testing</span>}
                        variant="outlined"
                        InputProps={{ readOnly: false }}
                    />
                </Box>
            </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setIsCheckoutOpen(false)} size="large" sx={{ color: 'text.secondary' }}>Cancel</Button>
            <Button 
                onClick={handlePlaceOrder} 
                variant="contained" 
                size="large"
                disabled={!customerName || !customerPhone}
                sx={{ px: 4 }}
            >
                Pay & Place Order
            </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
