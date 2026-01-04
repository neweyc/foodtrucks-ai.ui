import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  FormControlLabel, 
  Checkbox, 
  Stack, 
  Typography, 
  Alert 
} from '@mui/material';
import type { CreateVendorRequest, UpdateVendorRequest, Vendor } from '../../../api/client';

interface VendorFormProps {
  initialData?: Vendor;
  onSubmit: (data: CreateVendorRequest | UpdateVendorRequest) => Promise<void>;
  onCancel: () => void;
}

export default function VendorForm({ initialData, onSubmit, onCancel }: VendorFormProps) {
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    phoneNumber: '',
    website: '',
    isActive: true,
    email: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        phoneNumber: initialData.phoneNumber,
        website: initialData.website,
        isActive: initialData.isActive,
        email: '' // Email not editable on update
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      console.error(err);
      setError('Failed to save vendor. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Edit Vendor' : 'Add New Vendor'}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack spacing={2}>
        {!initialData && (
          <TextField
            label="Email (User Account)"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            type="email"
            helperText="A user account will be created with this email and password 'Password123!'"
          />
        )}
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          fullWidth
          helperText="Format: +1234567890"
        />
        <TextField
          label="Website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          fullWidth
        />
        
        {initialData && (
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isActive}
                onChange={handleChange}
                name="isActive"
              />
            }
            label="Is Active"
          />
        )}

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
