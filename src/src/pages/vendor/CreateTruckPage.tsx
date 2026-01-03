import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
import { createTruck } from '../../api/client';

export default function CreateTruckPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [schedule, setSchedule] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');

    try {
      await createTruck({
        name,
        description,
        schedule
      });
      navigate('/vendor/trucks');
    } catch (err: any) {
      console.error(err);
      setError('Failed to create truck.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <Box maxWidth={600} mx="auto">
      <Typography variant="h4" gutterBottom>Add New Truck</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            label="Truck Name"
            required
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Schedule (e.g. Mon-Fri 10am-2pm)"
            fullWidth
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/vendor/trucks')}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Creating...' : 'Create Truck'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
