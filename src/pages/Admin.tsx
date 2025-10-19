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
  Switch,
  FormControlLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
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
  Savings as RewardIcon,
  People as UsersIcon,
  Analytics as AnalyticsIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  AttachMoney as MoneyIcon,
  TrendingDown as TrendingDownIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useAccount } from 'wagmi';
import { useWallet } from '../context/WalletContext';
import {
  getOwner,
  getDirectIncome,
  getRoiPercent,
  getContractBalance,
  liquidity,
  changeDirectIncome,
  transferOwnership,
  updateRoiPercent,
  getAllStakeReward,
  getUsersLength,
  getUniqueUsers,
  getUserRecord,
  getContractPercent,
  getMaxRoi,
  getPercentDivider,
} from '../services/contractService';
import { formatUnits, parseUnits } from 'viem';

const Admin: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? JSON.parse(saved) : prefersDarkMode;
  });
  
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentOwner, setCurrentOwner] = useState('');
  const [directIncome, setDirectIncome] = useState('');
  const [contractBalance, setContractBalance] = useState('');
  const [totalStakeRewards, setTotalStakeRewards] = useState('');
  const [roiPercents, setRoiPercents] = useState<string[]>([]);
  const [totalUsers, setTotalUsers] = useState('0');
  const [contractPercent, setContractPercent] = useState('0');
  const [maxRoi, setMaxRoi] = useState('0');
  const [percentDivider, setPercentDivider] = useState('0');
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'warning' | 'error'>('healthy');
  const [activeTab, setActiveTab] = useState(0);
  const [userList, setUserList] = useState<any[]>([]);

  // Form states
  const [liquidityAmount, setLiquidityAmount] = useState('');
  const [newDirectIncome, setNewDirectIncome] = useState('');
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [roiIndex, setRoiIndex] = useState(1);
  const [newRoiPercent, setNewRoiPercent] = useState('');

  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    action: '',
    message: '',
    onConfirm: () => {},
  });
  const [alert, setAlert] = useState<{
    severity: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);

  const { account, isConnected } = useWallet();
  const { address } = useAccount();

  const darkTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: darkMode ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: darkMode ? '#0a0a0a' : '#fafafa',
        paper: darkMode ? '#1a1a1a' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
        secondary: darkMode ? '#b0b0b0' : '#757575',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: 'background.paper',
            color: 'text.primary',
            borderRadius: 16,
            boxShadow: darkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          },
        },
      },
    },
  });

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('adminDarkMode', JSON.stringify(newDarkMode));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || !address) {
        setLoading(false);
        return;
      }

      try {
        const [owner, income, balance, rewards, usersLength, contractPercent, maxRoi, percentDivider] = await Promise.all([
          getOwner(),
          getDirectIncome(),
          getContractBalance(),
          getAllStakeReward(),
          getUsersLength(),
          getContractPercent(),
          getMaxRoi(),
          getPercentDivider(),
        ]);

        setCurrentOwner(owner);
        setIsOwner(owner.toLowerCase() === address.toLowerCase());
        setDirectIncome(income.toString());
        setContractBalance(formatUnits(balance, 18));
        setTotalStakeRewards(formatUnits(rewards, 18));
        setTotalUsers(usersLength.toString());
        setContractPercent(contractPercent.toString());
        setMaxRoi(maxRoi.toString());
        setPercentDivider(percentDivider.toString());

        // Fetch ROI percentages
        const percents = [];
        for (let i = 1; i <= 14; i++) {
          const percent = await getRoiPercent(BigInt(i));
          percents[i] = percent.toString();
        }
        setRoiPercents(percents);

        // Fetch user list (first 20 users)
        const userCount = Number(usersLength);
        const users = [];
        for (let i = 0; i < Math.min(userCount, 20); i++) {
          try {
            const userAddress = await getUniqueUsers(BigInt(i));
            const userRecord = await getUserRecord(userAddress);
            users.push({
              address: userAddress,
              totalInvestment: formatUnits(userRecord.totalInvestment, 18),
              totalWithdrawn: formatUnits(userRecord.totalWithdrawn, 18),
              stakeCount: userRecord.stakeCount.toString(),
              isRegistered: userRecord.isRegistered,
            });
          } catch (error) {
            console.warn(`Failed to fetch user ${i}:`, error);
          }
        }
        setUserList(users);

        // Set system health
        if (parseFloat(formatUnits(balance, 18)) < 1000) {
          setSystemHealth('warning');
        } else if (parseFloat(formatUnits(balance, 18)) < 100) {
          setSystemHealth('error');
        } else {
          setSystemHealth('healthy');
        }

      } catch (error) {
        console.error('Error fetching admin data:', error);
        setAlert({ severity: 'error', message: 'Error fetching data' });
        setSystemHealth('error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isConnected, address]);

  const packages = [
    { name: 'Starter Pack', index: 1, price: 100, features: ['Basic ROI', 'Entry Level'] },
    { name: 'Silver Pack', index: 2, price: 200, features: ['Enhanced ROI', 'Silver Benefits'] },
    { name: 'Gold Pack', index: 3, price: 300, features: ['Premium ROI', 'Gold Benefits'] },
    { name: 'Platinum Pack', index: 4, price: 400, features: ['Platinum ROI', 'VIP Benefits'] },
    { name: 'Diamond Pack', index: 5, price: 500, features: ['Diamond ROI', 'Diamond Benefits'] },
    { name: 'Elite Pack', index: 6, price: 600, features: ['Elite ROI', 'Elite Benefits'] },
    { name: 'Premium Pack', index: 7, price: 700, features: ['Premium ROI', 'Premium Benefits'] },
    { name: 'Mega Pack', index: 8, price: 800, features: ['Mega ROI', 'Mega Benefits'] },
    { name: 'Pro Pack', index: 9, price: 900, features: ['Pro ROI', 'Professional Benefits'] },
    { name: 'Infinity Pack', index: 10, price: 1000, features: ['Infinity ROI', 'Infinity Benefits'] },
    { name: 'Titan Pack', index: 11, price: 2000, features: ['Titan ROI', 'Titan Benefits'] },
    { name: 'Galaxy Pack', index: 12, price: 3000, features: ['Galaxy ROI', 'Galaxy Benefits'] },
    { name: 'Royal Pack', index: 13, price: 4000, features: ['Royal ROI', 'Royal Benefits'] },
    { name: 'Legend Pack', index: 14, price: 5000, features: ['Legend ROI', 'Legend Benefits'] },
  ];

  const handleLiquidity = async () => {
    if (!liquidityAmount || !address) return;
    setActionLoading(true);
    setAlert(null);
    try {
      const amount = parseUnits(liquidityAmount, 18);
      await liquidity(amount, address as `0x${string}`);
      setAlert({ severity: 'success', message: 'Liquidity added successfully' });
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
      message: `Are you sure you want to change the direct income to ${newDirectIncome}%? This action cannot be undone.`,
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
          maxWidth="xl"
          sx={{
            mt: 2,
            mb: 2,
            background: darkMode
              ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRadius: 4,
            p: 3,
            minHeight: '100vh',
          }}
        >
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 4,
            p: 3,
            background: darkMode
              ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 3,
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                bgcolor: 'primary.main', 
                mr: 2, 
                width: 56, 
                height: 56,
              }}>
                <SecurityIcon sx={{ fontSize: '2rem' }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ 
                  color: 'primary.main', 
                  fontWeight: 'bold',
                }}>
                  Admin Dashboard
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Smart Contract Management
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                icon={systemHealth === 'healthy' ? <CheckIcon /> : systemHealth === 'warning' ? <WarningIcon /> : <ErrorIcon />}
                label={`System ${systemHealth}`}
                color={systemHealth === 'healthy' ? 'success' : systemHealth === 'warning' ? 'warning' : 'error'}
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={toggleDarkMode}
                    icon={<LightModeIcon />}
                    checkedIcon={<DarkModeIcon />}
                  />
                }
                label=""
              />
            </Box>
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

          {/* Key Metrics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: darkMode
                  ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                color: 'white',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {totalUsers}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Users
                      </Typography>
                    </Box>
                    <UsersIcon sx={{ fontSize: '3rem', opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: darkMode
                  ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        ${contractBalance}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Contract Balance
                      </Typography>
                    </Box>
                    <BalanceIcon sx={{ fontSize: '3rem', opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: darkMode
                  ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
                  : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        ${totalStakeRewards}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Rewards
                      </Typography>
                    </Box>
                    <RewardIcon sx={{ fontSize: '3rem', opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: darkMode
                  ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
                  : 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                color: 'white',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {Number(maxRoi) / 10}%
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Max ROI
                      </Typography>
                    </Box>
                    <RoiIcon sx={{ fontSize: '3rem', opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabs */}
          <Paper sx={{ mb: 3, borderRadius: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<DashboardIcon />} label="Dashboard" />
              <Tab icon={<UsersIcon />} label="Users" />
              <Tab icon={<RoiIcon />} label="Packages" />
              <Tab icon={<SettingsIcon />} label="Settings" />
            </Tabs>
          </Paper>

          {/* Dashboard Tab */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
                      Contract Overview
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <OwnerIcon sx={{ fontSize: '2rem', color: 'primary.main', mb: 1 }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            Contract Owner
                          </Typography>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                            {currentOwner.slice(0, 8)}...{currentOwner.slice(-6)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <IncomeIcon sx={{ fontSize: '2rem', color: 'success.main', mb: 1 }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            Direct Income
                          </Typography>
                          <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold' }}>
                            {Number(directIncome) / 10}%
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <SpeedIcon sx={{ fontSize: '2rem', color: 'warning.main', mb: 1 }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            Max ROI
                          </Typography>
                          <Typography variant="h5" color="warning.main" sx={{ fontWeight: 'bold' }}>
                            {Number(maxRoi) / 10}%
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <RewardIcon sx={{ fontSize: '2rem', color: 'info.main', mb: 1 }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            Total Rewards
                          </Typography>
                          <Typography variant="h5" color="info.main" sx={{ fontWeight: 'bold' }}>
                            ${totalStakeRewards}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      <AddIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Add Liquidity
                    </Typography>
                    <TextField
                      fullWidth
                      label="Amount (USDT)"
                      type="number"
                      value={liquidityAmount}
                      onChange={(e) => setLiquidityAmount(e.target.value)}
                      sx={{ mb: 2 }}
                      variant="outlined"
                    />
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
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      <EditIcon sx={{ mr: 1, color: 'secondary.main' }} />
                      Change Direct Income
                    </Typography>
                    <TextField
                      fullWidth
                      label="New Direct Income (%)"
                      type="number"
                      value={newDirectIncome}
                      onChange={(e) => setNewDirectIncome(e.target.value)}
                      sx={{ mb: 2 }}
                      variant="outlined"
                    />
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={handleChangeDirectIncome}
                      disabled={actionLoading || !newDirectIncome}
                      fullWidth
                      sx={{ borderRadius: 2, py: 1.5 }}
                    >
                      {actionLoading ? <CircularProgress size={24} /> : 'Update Income'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Users Tab */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                      <UsersIcon sx={{ mr: 1 }} />
                      User Management ({userList.length} users)
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>User Address</TableCell>
                            <TableCell align="right">Investment</TableCell>
                            <TableCell align="right">Withdrawn</TableCell>
                            <TableCell align="right">Net Balance</TableCell>
                            <TableCell align="right">Stakes</TableCell>
                            <TableCell align="center">Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {userList.map((user, index) => {
                            const netBalance = parseFloat(user.totalInvestment) - parseFloat(user.totalWithdrawn);
                            return (
                              <TableRow key={index}>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    {user.address.slice(0, 8)}...{user.address.slice(-6)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                                    ${parseFloat(user.totalInvestment).toFixed(2)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
                                    ${parseFloat(user.totalWithdrawn).toFixed(2)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography variant="body2" color={netBalance >= 0 ? 'success.main' : 'error.main'} sx={{ fontWeight: 600 }}>
                                    ${netBalance.toFixed(2)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Chip label={user.stakeCount} size="small" color="info" />
                                </TableCell>
                                <TableCell align="center">
                                  <Chip
                                    label={user.isRegistered ? 'Active' : 'Inactive'}
                                    color={user.isRegistered ? 'success' : 'default'}
                                    size="small"
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Packages Tab */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                      <RoiIcon sx={{ mr: 1 }} />
                      Investment Packages & ROI Rates
                    </Typography>
                    <Grid container spacing={2}>
                      {packages.map((pkg) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={pkg.index}>
                          <Card sx={{ 
                            height: '100%',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                            },
                          }}>
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                              <Typography variant="h6" sx={{ 
                                fontWeight: 'bold', 
                                mb: 1,
                                color: 'primary.main',
                              }}>
                                {pkg.name}
                              </Typography>
                              
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                mb: 2
                              }}>
                                <MoneyIcon sx={{ mr: 1, color: 'success.main' }} />
                                <Typography variant="h5" sx={{ 
                                  fontWeight: 'bold',
                                  color: 'success.main'
                                }}>
                                  ${pkg.price}
                                </Typography>
                              </Box>

                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                mb: 2
                              }}>
                                <RoiIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6" sx={{ 
                                  fontWeight: 'bold',
                                  color: 'primary.main'
                                }}>
                                  {(roiPercents[pkg.index] || 10) / 10}% ROI
                                </Typography>
                              </Box>

                              <Box sx={{ mt: 2 }}>
                                {pkg.features.map((feature, idx) => (
                                  <Chip
                                    key={idx}
                                    label={feature}
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                      m: 0.5,
                                      fontSize: '0.75rem',
                                      height: 24
                                    }}
                                  />
                                ))}
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Settings Tab */}
          {activeTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      <TransferIcon sx={{ mr: 1, color: 'error.main' }} />
                      Transfer Ownership
                    </Typography>
                    <TextField
                      fullWidth
                      label="New Owner Address"
                      value={newOwnerAddress}
                      onChange={(e) => setNewOwnerAddress(e.target.value)}
                      sx={{ mb: 2 }}
                      variant="outlined"
                    />
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
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      <UpdateIcon sx={{ mr: 1, color: 'info.main' }} />
                      Update ROI Percent
                    </Typography>
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
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Confirmation Dialog */}
          <Dialog
            open={confirmDialog.open}
            onClose={() => setConfirmDialog({ open: false, action: '', message: '', onConfirm: () => {} })}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
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