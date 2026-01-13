import { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Alert, Paper, Tabs, Tab, CircularProgress 
} from '@mui/material';
import { getMe, getVendor, updateVendor, changePassword, getVendorOnboardingLink } from '../../api/client';
import type { Vendor } from '../../api/client';

export default function ProfilePage() {
    const [tabIndex, setTabIndex] = useState(0);
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Vendor Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [website, setWebsite] = useState('');

    // Password Form State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Stripe State
    const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const user = await getMe();
            if (user.vendorId) {
                const v = await getVendor(user.vendorId);
                setVendor(v);
                setName(v.name);
                setDescription(v.description);
                setPhoneNumber(v.phoneNumber);
                setWebsite(v.website);
                // @ts-ignore
                setStripeAccountId(v.stripeAccountId);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!vendor) return;
        setError('');
        setSuccess('');
        try {
            await updateVendor(vendor.id, {
                name,
                description,
                phoneNumber,
                website,
                isActive: vendor.isActive
            });
            setSuccess('Profile updated successfully.');
        } catch (err) {
            console.error(err);
            setError('Failed to update profile.');
        }
    };

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

    const handleConnectStripe = async () => {
        if (!vendor) return;
        try {
            const result = await getVendorOnboardingLink(vendor.id);
            window.location.href = result.url;
        } catch (err) {
            console.error(err);
            setError('Failed to initiate Stripe connection.');
        }
    };

    if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">My Profile</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} sx={{ mb: 3 }}>
                <Tab label="Business Profile" />
                <Tab label="Security" />
                <Tab label="Payouts" />
            </Tabs>

            {tabIndex === 0 && (
                <Paper sx={{ p: 4, maxWidth: 600 }}>
                    <Typography variant="h6" gutterBottom>Business Details</Typography>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField 
                            label="Business Name" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            fullWidth 
                            required 
                        />
                        <TextField 
                            label="Description" 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            fullWidth 
                            multiline 
                            rows={3} 
                        />
                        <TextField 
                            label="Phone Number" 
                            value={phoneNumber} 
                            onChange={e => setPhoneNumber(e.target.value)} 
                            fullWidth 
                            required 
                        />
                        <TextField 
                            label="Website" 
                            value={website} 
                            onChange={e => setWebsite(e.target.value)} 
                            fullWidth 
                        />
                        <Button 
                            variant="contained" 
                            size="large" 
                            onClick={handleUpdateProfile}
                            sx={{ mt: 2 }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Paper>
            )}

            {tabIndex === 1 && (
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
            )}

            {tabIndex === 2 && (
                <Paper sx={{ p: 4, maxWidth: 600 }}>
                    <Typography variant="h6" gutterBottom>Payout Settings</Typography>
                    <Typography paragraph color="text.secondary">
                        Connect your bank account to receive payouts directly from orders.
                    </Typography>
                    
                    {stripeAccountId ? (
                        <Alert severity="success">
                            Your account is connected to Stripe! You will receive payouts automatically.
                        </Alert>
                    ) : (
                        <Box>
                             <Alert severity="warning" sx={{ mb: 3 }}>
                                Payouts are not set up. You cannot receive funds until you connect a bank account.
                            </Alert>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                size="large" 
                                onClick={handleConnectStripe}
                            >
                                Connect with Stripe
                            </Button>
                        </Box>
                    )}
                </Paper>
            )}
        </Box>
    );
}
