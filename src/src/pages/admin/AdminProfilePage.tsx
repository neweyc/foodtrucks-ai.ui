import { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Alert, Paper 
} from '@mui/material';
import { changePassword } from '../../api/client';

export default function AdminProfilePage() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Password Form State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }
        setError('');
        setSuccess('');
        try {
            await changePassword({ oldPassword, newPassword });
            setSuccess('Password changed successfully.');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error(err);
            setError('Failed to change password. Please check your old password.');
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">My Profile</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Paper sx={{ p: 4, maxWidth: 600 }}>
                <Typography variant="h6" gutterBottom>Change Password</Typography>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField 
                        label="Current Password" 
                        type="password"
                        value={oldPassword} 
                        onChange={e => setOldPassword(e.target.value)} 
                        fullWidth 
                        required 
                    />
                    <TextField 
                        label="New Password" 
                        type="password"
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)} 
                        fullWidth 
                        required 
                    />
                    <TextField 
                        label="Confirm New Password" 
                        type="password"
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        fullWidth 
                        required 
                    />
                    <Button 
                        variant="contained" 
                        size="large" 
                        onClick={handleChangePassword}
                        sx={{ mt: 2 }}
                    >
                        Update Password
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
