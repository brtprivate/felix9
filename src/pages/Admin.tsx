import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Card,
  CardContent,
  Fade,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  createTheme,
  ThemeProvider,
  useMediaQuery,
  CssBaseline,
  useTheme,
} from '@mui/material';
import {
  AccountBalanceWallet as BalanceIcon,
  Person as OwnerIcon,
  TrendingUp as RoiIcon,
  MonetizationOn as IncomeIcon,
  Add as AddIcon,
  Edit as EditIcon,
  TransferWithinAStation as TransferIcon,
  Update as UpdateIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useAccount } from 'wagmi';
import { useWallet } from '../context/WalletContext';
import {
  dwcContractInteractions,
  getOwner,
  getDirectIncome,
  getRoiPercent,
  getContractBalance,
  liquidity,
  changeDirectIncome,
  transferOwnership,
  updateRoiPercent,
} from '../services/contractService';
import { formatUnits, parseUnits } from 'viem';

const Admin: React.FC = () => {
  const theme = useTheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentOwner, setCurrentOwner] = useState('');
  const [directIncome, setDirectIncome] = useState('');
  const [contractBalance, setContractBalance] = useState('');
  const [roiPercents, setRoiPercents] = useState<string[]>([]);

  // Form states
  const [liquidityAmount, setLiquidityAmount] = useState('');
  const [newDirectIncome, setNewDirectIncome] = useState('');
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [roiIndex, setRoiIndex] = useState(1); // Start from 1
  const [newRoiPercent, setNewRoiPercent] = useState('');

  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: string; message: string; onConfirm: () => void }>({
    open: false,
    action: '',
    message: '',
    onConfirm: () => {},
  });
  const [alert, setAlert] = useState<{ severity: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);

  const { account, isConnected } = useWallet();
  const { address } = useAccount();

  const darkTheme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: prefersDarkMode ? '#121212' : '#ffffff',
        paper: prefersDarkMode ? '#1e1e1e' : '#f5f5f5',
      },
      text: {
        primary: prefersDarkMode ? '#ffffff' : '#000000',
        secondary: prefersDarkMode ? '#b0b0b0' : '#757575',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: 'background.paper',
            color: 'text.primary',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: 'background.paper',
            color: 'text.primary',
          },
        },
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || !address) {
        setLoading(false);
        return;
      }

      try {
        const owner = await getOwner();
        setCurrentOwner(owner);
        setIsOwner(owner.toLowerCase() === address.toLowerCase());

        const income = await getDirectIncome();
        setDirectIncome(income.toString());

        const balance = await getContractBalance();
        setContractBalance(formatUnits(balance, 18));

        const percents = [];
        for (let i = 1; i <= 14; i++) { // Start from 1 to 14
          const percent = await getRoiPercent(BigInt(i));
          percents[i] = percent.toString(); // Index from 1
        }
        setRoiPercents(percents);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setAlert({ severity: 'error', message: 'Error fetching data' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isConnected, address]);

  const packages = [
    { name: 'Starter Pack', index: 1, functionName: 'buyStaterPack', price: 100, roiPercent: 1, features: ['Basic ROI', 'Entry Level', 'Referral Bonus'] },
    { name: 'Silver Pack', index: 2, functionName: 'buySilverPack', price: 200, roiPercent: 1, features: ['Enhanced ROI', 'Silver Benefits', 'Higher Referral Bonus'] },
    { name: 'Gold Pack', index: 3, functionName: 'buyGoldPack', price: 300, roiPercent: 1, features: ['Premium ROI', 'Gold Benefits', 'Premium Referral Bonus'] },
    { name: 'Platinum Pack', index: 4, functionName: 'buyPlatinumPack', price: 400, roiPercent: 1, features: ['Platinum ROI', 'VIP Benefits', 'Elite Referral Bonus'] },
    { name: 'Diamond Pack', index: 5, functionName: 'buyDiamondPack', price: 500, roiPercent: 1, features: ['Diamond ROI', 'Diamond Benefits', 'Maximum Referral Bonus'] },
    { name: 'Elite Pack', index: 6, functionName: 'buyElitePack', price: 600, roiPercent: 1, features: ['Elite ROI', 'Elite Benefits', 'Elite Referral Bonus'] },
    { name: 'Premium Pack', index: 7, functionName: 'buyPremiumPack', price: 700, roiPercent: 1, features: ['Premium ROI', 'Premium Benefits', 'Premium Referral Bonus'] },
    { name: 'Mega Pack', index: 8, functionName: 'buyMegaPack', price: 800, roiPercent: 1, features: ['Mega ROI', 'Mega Benefits', 'Mega Referral Bonus'] },
    { name: 'Pro Pack', index: 9, functionName: 'buyProPack', price: 900, roiPercent: 1, features: ['Pro ROI', 'Professional Benefits', 'Pro Referral Bonus'] },
    { name: 'Infinity Pack', index: 10, functionName: 'buyInfinityPack', price: 1000, roiPercent: 1, features: ['Infinity ROI', 'Infinity Benefits', 'Infinity Referral Bonus'] },
    { name: 'Titan Pack', index: 11, functionName: 'buyTitanPack', price: 2000, roiPercent: 1, features: ['Titan ROI', 'Titan Benefits', 'Titan Referral Bonus'] },
    { name: 'Galaxy Pack', index: 12, functionName: 'buyGalaxyPack', price: 3000, roiPercent: 1, features: ['Galaxy ROI', 'Galaxy Benefits', 'Galaxy Referral Bonus'] },
    { name: 'Royal Pack', index: 13, functionName: 'buyRoyalPack', price: 4000, roiPercent: 1, features: ['Royal ROI', 'Royal Benefits', 'Royal Referral Bonus'] },
    { name: 'Legend Pack', index: 14, functionName: 'buyLegendPack', price: 5000, roiPercent: 1.2, features: ['Legend ROI', 'Legend Benefits', 'Legend Referral Bonus'] },
  ];

  const handleLiquidity = async () => {
    if (!liquidityAmount || !address) return;
    setActionLoading(true);
    setAlert(null);
    try {
      const amount = parseUnits(liquidityAmount, 18);
      await liquidity(amount, address as `0x${string}`);
      setAlert({ severity: 'success', message: 'Liquidity added successfully' });
      // Refresh balance
      const balance = await getContractBalance();
      setContractBalance(formatUnits(balance, 18));
      setLiquidityAmount('');
    } catch (error: any) {
      setAlert({ severity: 'error', message: `Error: ${error.message}` });
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeDirectIncome = async () => {
    if (!newDirectIncome || !address) return;
    setConfirmDialog({
      open: true,
      action: 'Change Direct Income',
      message: `Are you sure you want to change the direct income to ${newDirectIncome}? This action cannot be undone.`,
      onConfirm: async () => {
        setConfirmDialog({ open: false, action: '', message: '', onConfirm: () => {} });
        setActionLoading(true);
        setAlert(null);
        try {
          const income = BigInt(newDirectIncome);
          await changeDirectIncome(income, address as `0x${string}`);
          setAlert({ severity: 'success', message: 'Direct income changed successfully' });
          setDirectIncome(newDirectIncome);
          setNewDirectIncome('');
        } catch (error: any) {
          setAlert({ severity: 'error', message: `Error: ${error.message}` });
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleTransferOwnership = async () => {
    if (!newOwnerAddress || !address) return;
    setConfirmDialog({
      open: true,
      action: 'Transfer Ownership',
      message: `Are you sure you want to transfer ownership to ${newOwnerAddress}? This action cannot be undone and you will lose admin privileges.`,
      onConfirm: async () => {
        setConfirmDialog({ open: false, action: '', message: '', onConfirm: () => {} });
        setActionLoading(true);
        setAlert(null);
        try {
          await transferOwnership(newOwnerAddress as `0x${string}`, address as `0x${string}`);
          setAlert({ severity: 'success', message: 'Ownership transferred successfully' });
          setCurrentOwner(newOwnerAddress);
          setIsOwner(newOwnerAddress.toLowerCase() === address.toLowerCase());
          setNewOwnerAddress('');
        } catch (error: any) {
          setAlert({ severity: 'error', message: `Error: ${error.message}` });
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleUpdateRoi = async () => {
    if (!newRoiPercent || !address) return;
    setActionLoading(true);
    setAlert(null);
    try {
      const percent = BigInt(newRoiPercent);
      await updateRoiPercent(BigInt(roiIndex), percent, address as `0x${string}`);
      setAlert({ severity: 'success', message: 'ROI percent updated successfully' });
      const updatedPercents = [...roiPercents];
      updatedPercents[roiIndex] = newRoiPercent;
      setRoiPercents(updatedPercents);
      setNewRoiPercent('');
    } catch (error: any) {
      setAlert({ severity: 'error', message: `Error: ${error.message}` });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  if (!isConnected) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="warning">Please connect your wallet to access admin panel.</Alert>
        </Container>
      </ThemeProvider>
    );
  }

  if (!isOwner) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error">You are not the owner of the contract.</Alert>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Fade in={true} timeout={500}>
        <Container
          maxWidth="lg"
          sx={{
            mt: 4,
            mb: 4,
            background: prefersDarkMode 
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' 
              : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 3,
            p: 3,
            boxShadow: prefersDarkMode ? 6 : 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <SecurityIcon sx={{ mr: 2, color: 'primary.main', fontSize: '2rem' }} />
            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              Admin Panel
            </Typography>
          </Box>

          {alert && (
            <Alert
              severity={alert.severity}
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setAlert(null)}
            >
              {alert.message}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Current Values */}
            <Grid item xs={12}>
              <Card
                sx={{
                  background: prefersDarkMode 
                    ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'common.white',
                  boxShadow: 4,
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <OwnerIcon sx={{ mr: 1, fontSize: '1.5rem' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Current Contract Values
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <OwnerIcon sx={{ mr: 1, color: 'secondary.main' }} />
                        <Typography variant="body1">
                          <strong>Owner:</strong> {currentOwner.slice(0, 6)}...{currentOwner.slice(-4)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IncomeIcon sx={{ mr: 1, color: 'success.main' }} />
                        <Typography variant="body1">
                          <strong>Direct Income:</strong> {directIncome/10} %
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BalanceIcon sx={{ mr: 1, color: 'warning.main' }} />
                        <Typography variant="body1">
                          <strong>Contract Balance:</strong> {contractBalance} USDC
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <RoiIcon sx={{ mr: 1, color: 'info.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        ROI Percents 
                      </Typography>
                    </Box>
                    <Grid container spacing={1}>
                      {packages.map((pkg) => (
                        <Grid item xs={6} sm={4} md={3} key={pkg.index}>
                          <Paper
                            sx={{
                              p: 1.5,
                              bgcolor: prefersDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                              borderRadius: 2,
                              textAlign: 'center',
                              border: `1px solid ${prefersDarkMode ? '#404040' : '#e0e0e0'}`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 2,
                              },
                            }}
                            elevation={0}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                              {pkg.name}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'info.main' }}>
                              {(roiPercents[pkg.index] || pkg.roiPercent)/10}%
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                              ${pkg.price}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Add Liquidity */}
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3, borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AddIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      Add Liquidity
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    label="Amount (USDC)"
                    type="number"
                    value={liquidityAmount}
                    onChange={(e) => setLiquidityAmount(e.target.value)}
                    sx={{ mb: 2 }}
                    variant="outlined"
                  />
                  <Tooltip title="Add USDC liquidity to the contract">
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleLiquidity}
                      disabled={actionLoading || !liquidityAmount}
                      fullWidth
                      sx={{ borderRadius: 2, py: 1.5 }}
                    >
                      {actionLoading ? <CircularProgress size={24} /> : 'Add Liquidity'}
                    </Button>
                  </Tooltip>
                </CardContent>
              </Card>
            </Grid>

            {/* Change Direct Income */}
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3, borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EditIcon sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                      Change Direct Income
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    label="New Direct Income"
                    type="number"
                    value={newDirectIncome}
                    onChange={(e) => setNewDirectIncome(e.target.value)}
                    sx={{ mb: 2 }}
                    variant="outlined"
                  />
                  <Tooltip title="Change the direct income percentage (irreversible)">
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={handleChangeDirectIncome}
                      disabled={actionLoading || !newDirectIncome}
                      fullWidth
                      sx={{ borderRadius: 2, py: 1.5 }}
                    >
                      {actionLoading ? <CircularProgress size={24} /> : 'Change Direct Income'}
                    </Button>
                  </Tooltip>
                </CardContent>
              </Card>
            </Grid>

            {/* Transfer Ownership */}
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3, borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TransferIcon sx={{ mr: 1, color: 'error.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                      Transfer Ownership
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    label="New Owner Address"
                    value={newOwnerAddress}
                    onChange={(e) => setNewOwnerAddress(e.target.value)}
                    sx={{ mb: 2 }}
                    variant="outlined"
                  />
                  <Tooltip title="Transfer contract ownership (irreversible)">
                    <Button
                      variant="contained"
                      startIcon={<TransferIcon />}
                      onClick={handleTransferOwnership}
                      disabled={actionLoading || !newOwnerAddress}
                      fullWidth
                      sx={{ borderRadius: 2, py: 1.5 }}
                    >
                      {actionLoading ? <CircularProgress size={24} /> : 'Transfer Ownership'}
                    </Button>
                  </Tooltip>
                </CardContent>
              </Card>
            </Grid>

            {/* Update ROI Percent */}
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3, borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <UpdateIcon sx={{ mr: 1, color: 'info.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                      Update ROI Percent
                    </Typography>
                  </Box>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Package</InputLabel>
                    <Select
                      value={roiIndex}
                      onChange={(e) => setRoiIndex(Number(e.target.value))}
                      variant="outlined"
                    >
                      {packages.map((pkg) => (
                        <MenuItem key={pkg.index} value={pkg.index}>
                          {pkg.name} (${pkg.price})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="New ROI Percent"
                    type="number"
                    value={newRoiPercent}
                    onChange={(e) => setNewRoiPercent(e.target.value)}
                    sx={{ mb: 2 }}
                    variant="outlined"
                  />
                  <Tooltip title="Update ROI percentage for selected package">
                    <Button
                      variant="contained"
                      startIcon={<UpdateIcon />}
                      onClick={handleUpdateRoi}
                      disabled={actionLoading || !newRoiPercent}
                      fullWidth
                      sx={{ borderRadius: 2, py: 1.5 }}
                    >
                      {actionLoading ? <CircularProgress size={24} /> : 'Update ROI'}
                    </Button>
                  </Tooltip>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Confirmation Dialog */}
          <Dialog
            open={confirmDialog.open}
            onClose={() => setConfirmDialog({ open: false, action: '', message: '', onConfirm: () => {} })}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            PaperProps={{
              sx: {
                backgroundColor: 'background.paper',
                color: 'text.primary',
              },
            }}
          >
            <DialogTitle id="confirm-dialog-title">{confirmDialog.action}</DialogTitle>
            <DialogContent>
              <DialogContentText id="confirm-dialog-description">
                {confirmDialog.message}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setConfirmDialog({ open: false, action: '', message: '', onConfirm: () => {} })}
                color="inherit"
              >
                Cancel
              </Button>
              <Button onClick={confirmDialog.onConfirm} color="primary" variant="contained">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Fade>
    </ThemeProvider>
  );
};

export default Admin;