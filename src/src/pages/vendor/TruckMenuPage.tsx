import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Container, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions, List, ListItem, ListItemText, 
  Accordion, AccordionSummary, AccordionDetails, Divider, Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getTruck, addMenuCategory, addMenuItem, editMenuItem } from '../../api/client';
import type { Truck, AddMenuItemRequest, MenuItem } from '../../api/client';

export default function TruckMenuPage() {
  const { truckId } = useParams();
  const navigate = useNavigate();
  const [truck, setTruck] = useState<Truck | null>(null);
  
  // Dialog State
  const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  const [isItemDialogOpen, setItemDialogOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null); // New state for edit mode
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  
  // Customization State
  const [itemSizes, setItemSizes] = useState<{name: string, price: string}[]>([]);
  const [itemOptions, setItemOptions] = useState<{name: string, price: string}[]>([]);
  const [newSizeName, setNewSizeName] = useState('');
  const [newSizePrice, setNewSizePrice] = useState('');
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionPrice, setNewOptionPrice] = useState('');

  const loadTruck = () => {
    if (truckId) {
        getTruck(parseInt(truckId)).then(setTruck).catch(console.error);
    }
  };

  useEffect(() => {
    loadTruck();
  }, [truckId]);

  const handleAddCategory = async () => {
    if (truckId && categoryName) {
        await addMenuCategory(parseInt(truckId), categoryName);
        setCategoryDialogOpen(false);
        setCategoryName('');
        loadTruck();
    }
  };

  const addSize = () => {
    if(newSizeName && newSizePrice) {
        setItemSizes([...itemSizes, { name: newSizeName, price: newSizePrice }]);
        setNewSizeName('');
        setNewSizePrice('');
    }
  };

  const removeSize = (index: number) => {
    setItemSizes(itemSizes.filter((_, i) => i !== index));
  };

  const addOption = () => {
      if(newOptionName && newOptionPrice) {
          setItemOptions([...itemOptions, { name: newOptionName, price: newOptionPrice }]);
          setNewOptionName('');
          setNewOptionPrice('');
      }
    };

  const removeOption = (index: number) => {
    setItemOptions(itemOptions.filter((_, i) => i !== index));
  };

  const handleSaveItem = async () => {
    if (activeCategoryId && itemName && itemPrice) {
        try {
            const payload: AddMenuItemRequest = {
                name: itemName,
                description: itemDescription,
                price: parseFloat(itemPrice),
                isAvailable: true,
                sizes: itemSizes.map(s => ({ name: s.name, price: parseFloat(s.price) })),
                options: itemOptions.map(o => ({ name: o.name, price: parseFloat(o.price), section: 'Add-ons' }))
            };

            if (editingItemId) {
                await editMenuItem(editingItemId, payload);
            } else {
                await addMenuItem(activeCategoryId, payload);
            }
            
            setItemDialogOpen(false);
            resetItemForm();
            loadTruck();
        } catch (error) {
            console.error("Failed to save item:", error);
            alert("Failed to save item. Please try again.");
        }
    }
  };

  const resetItemForm = () => {
    setItemName('');
    setItemDescription('');
    setItemPrice('');
    setItemSizes([]);
    setItemOptions([]);
    setEditingItemId(null);
  };

  const openAddDialog = (categoryId: number) => {
    resetItemForm();
    setActiveCategoryId(categoryId);
    setItemDialogOpen(true);
  };

  const openEditDialog = (categoryId: number, item: MenuItem) => {
    setActiveCategoryId(categoryId);
    setEditingItemId(item.id);
    setItemName(item.name);
    setItemDescription(item.description);
    setItemPrice(item.price.toString());
    setItemSizes(item.sizes?.map(s => ({ name: s.name, price: s.price.toString() })) || []);
    setItemOptions(item.options?.map(o => ({ name: o.name, price: o.price.toString() })) || []);
    setItemDialogOpen(true);
  };

  if (!truck) return <Box sx={{ p: 4 }}>Loading...</Box>;

  return (
    <Container maxWidth="lg" sx={{ pb: 8, mt: -1 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/vendor/trucks')} sx={{ mb: 2 }}>
            Back to Trucks
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
                <Typography variant="h3" fontWeight="bold">{truck.name}</Typography>
                <Typography color="text.secondary">Menu Management</Typography>
            </Box>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => setCategoryDialogOpen(true)}
                size="large"
            >
                New Category
            </Button>
        </Box>
      </Box>

      {/* Menu Categories */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {truck.menuCategories?.length === 0 && (
            <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50' }}>
                <Typography color="text.secondary" gutterBottom>Your menu is empty.</Typography>
                <Typography variant="h6">Create a category to get started (e.g. "Tacos", "Drinks")</Typography>
            </Paper>
        )}

        {truck.menuCategories?.map((category) => (
            <Accordion 
                key={category.id} 
                defaultExpanded 
                disableGutters 
                elevation={0}
                sx={{ 
                    border: '1px solid', 
                    borderColor: 'divider',
                    borderRadius: '16px !important',
                    '&:before': { display: 'none' },
                    overflow: 'hidden'
                }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'grey.50' }}>
                    <Typography variant="h6" fontWeight="bold">{category.name}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                     <List>
                        {category.menuItems?.map((item, index) => (
                            <div key={item.id}>
                                <ListItem alignItems="flex-start" sx={{ px: 3, py: 2 }}>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="subtitle1" fontWeight="bold">{item.name}</Typography>
                                                <Typography variant="subtitle1" color="primary" fontWeight="bold">${item.price}</Typography>
                                            </Box>
                                        }
                                        secondary={item.description}
                                    />
                                    <Box sx={{ alignSelf: 'center', mr: 2 }}>
                                        <Button
                                            startIcon={<EditIcon />}
                                            onClick={() => openEditDialog(category.id, item)}
                                            size="small"
                                        >
                                            Edit
                                        </Button>
                                    </Box>
                                </ListItem>
                                {index < (category.menuItems?.length || 0) - 1 && <Divider component="li" />}
                            </div>
                        ))}
                        {(!category.menuItems || category.menuItems.length === 0) && (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">No items in this category yet.</Typography>
                            </Box>
                        )}
                        <Divider />
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button 
                                startIcon={<AddIcon />} 
                                onClick={() => openAddDialog(category.id)}
                            >
                                Add Item to {category.name}
                            </Button>
                        </Box>
                     </List>
                </AccordionDetails>
            </Accordion>
        ))}
      </Box>

      {/* Dialogs */}
      <Dialog open={isCategoryDialogOpen} onClose={() => setCategoryDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>New Category</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Category Name"
                fullWidth
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Burgers, Sides, Drinks"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCategory} variant="contained" disabled={!categoryName}>Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isItemDialogOpen} onClose={() => setItemDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItemId ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField
                    label="Item Name"
                    fullWidth
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                />
                <TextField
                    label="Price ($)"
                    type="number"
                    fullWidth
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                />
                <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={2}
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                />

                <Divider sx={{ my: 1 }} />
                
                {/* Sizes */}
                <Typography variant="subtitle2">Sizes (Optional)</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField 
                        label="Size Name" 
                        size="small" 
                        value={newSizeName} 
                        onChange={e => setNewSizeName(e.target.value)} 
                    />
                    <TextField 
                        label="Price" 
                        size="small" 
                        type="number" 
                        value={newSizePrice} 
                        onChange={e => setNewSizePrice(e.target.value)} 
                        sx={{ width: 100 }}
                    />
                    <Button variant="outlined" onClick={addSize} disabled={!newSizeName || !newSizePrice}>Add</Button>
                </Box>
                {itemSizes.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {itemSizes.map((s, i) => (
                            <Box key={i} sx={{ bgcolor: 'grey.100', pl: 1, pr: 0.5, py: 0.5, borderRadius: 1, fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
                                {s.name} (${s.price})
                                <Box component="span" sx={{ cursor: 'pointer', ml: 0.5, display: 'flex' }} onClick={() => removeSize(i)}>
                                     <DeleteIcon fontSize="small" color="action" />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}

                <Divider sx={{ my: 1 }} />

                {/* Options */}
                <Typography variant="subtitle2">Options / Add-ons (Optional)</Typography>
                 <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField 
                        label="Option Name" 
                        size="small" 
                        value={newOptionName} 
                        onChange={e => setNewOptionName(e.target.value)} 
                    />
                    <TextField 
                        label="Price" 
                        size="small" 
                        type="number" 
                        value={newOptionPrice} 
                        onChange={e => setNewOptionPrice(e.target.value)} 
                        sx={{ width: 100 }}
                    />
                    <Button variant="outlined" onClick={addOption} disabled={!newOptionName || !newOptionPrice}>Add</Button>
                </Box>
                 {itemOptions.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {itemOptions.map((o, i) => (
                            <Box key={i} sx={{ bgcolor: 'grey.100', pl: 1, pr: 0.5, py: 0.5, borderRadius: 1, fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
                                {o.name} (+${o.price})
                                <Box component="span" sx={{ cursor: 'pointer', ml: 0.5, display: 'flex' }} onClick={() => removeOption(i)}>
                                     <DeleteIcon fontSize="small" color="action" />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setItemDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveItem} variant="contained" disabled={!itemName || !itemPrice}>
                {editingItemId ? 'Save Changes' : 'Add Item'}
            </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
