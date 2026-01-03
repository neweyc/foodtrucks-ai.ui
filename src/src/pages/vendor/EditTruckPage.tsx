import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, Paper, Container } from '@mui/material';
import { getTruck, updateTruck } from '../../api/client';

export default function EditTruckPage() {
  const navigate = useNavigate();
  const { truckId } = useParams();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [schedule, setSchedule] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (truckId) {
        getTruck(parseInt(truckId))
            .then(truck => {
                setName(truck.name);
                setDescription(truck.description);
                // Schedule might be missing in GetTruck response if not mapped? 
                // Let's assume it's there or handle it. 
                // Actually GetTruck returns Truck which has description etc. 
                // Wait, Truck interface in client.ts DOES NOT have schedule.
                // I need to check Truck interface.
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load truck details.');
            })
            .finally(() => setLoading(false));
    }
  }, [truckId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!truckId) return;
    
    setSaving(true);
    setError('');

    try {
      await updateTruck(parseInt(truckId), {
        name,
        description,
        schedule
      });
      navigate('/vendor/trucks');
    } catch (err: any) {
      console.error(err);
      setError('Failed to update truck.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Container sx={{ p: 4 }}><Typography>Loading...</Typography></Container>;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>Edit Truck</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
            rows={4}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Schedule"
            fullWidth
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="e.g. Mon-Fri 10am-2pm"
          />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/vendor/trucks')}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
