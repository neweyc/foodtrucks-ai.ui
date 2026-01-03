import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  Dialog, 
  DialogContent 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getVendors, createVendor, updateVendor, deleteVendor } from '../../../api/client';
import type { Vendor } from '../../../api/client';
import VendorForm from './VendorForm';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | undefined>(undefined);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const data = await getVendors();
      setVendors(data);
    } catch (err) {
      console.error('Failed to fetch vendors', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleAddKey = () => {
    setSelectedVendor(undefined);
    setOpenForm(true);
  };

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setOpenForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
      try {
        await deleteVendor(id);
        fetchVendors();
      } catch (err) {
        console.error('Failed to delete vendor', err);
        alert('Failed to delete vendor. Ensure they have no active trucks.');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedVendor) {
        await updateVendor(selectedVendor.id, data);
      } else {
        await createVendor(data);
      }
      setOpenForm(false);
      fetchVendors();
    } catch (err) {
      throw err; // Form handles error display
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Vendors</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddKey}
        >
          Add Vendor
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.phoneNumber}</TableCell>
                <TableCell>
                    {vendor.website && (
                        <a href={vendor.website} target="_blank" rel="noopener noreferrer">
                            Link
                        </a>
                    )}
                </TableCell>
                <TableCell>{vendor.isActive ? 'Active' : 'Inactive'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(vendor)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(vendor.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {vendors.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No vendors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogContent>
          <VendorForm 
            initialData={selectedVendor} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setOpenForm(false)} 
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
