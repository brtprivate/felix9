import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Alert,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useWallet } from '../context/WalletContext';
import { useChainId, useSwitchChain } from 'wagmi';
import { BSC_TESTNET_CHAIN_ID, dwcContractInteractions } from '../services/contractService';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '../config/web3modal';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import useMLMData from '../hook/useMLMData';
import usePackageDetails from '../hook/usePackageDetails';
import PackagePurchase from '../components/PackagePurchase';
import ReferralSection from '../components/ReferralSection';
import PerformanceOverview from '../components/PerformanceOverview';

const Dashboard = () => {
  const wallet = useWallet();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const { mlmData, stakes, fetchMlmData, notRegistered } = useMLMData(wallet, chainId, switchChain, setError, setIsLoading);
  const { packageDetails, packages } = usePackageDetails();

  // ============================
  // Register user
  // ============================
  const handleRegister = async () => {
    if (!wallet.isConnected || !wallet.account) {
      setError('Please connect your wallet to register.');
      return;
    }

    if (!referralCode.trim()) {
      setError('Referral address is required. Please enter a valid referral address.');
      return;
    }

    if (chainId !== BSC_TESTNET_CHAIN_ID) {
      try {
        await switchChain({ chainId: BSC_TESTNET_CHAIN_ID });
      } catch (error) {
        setError('Please switch to BSC Testnet.');
        return;
      }
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const registerTx = await dwcContractInteractions.registration(referralCode.trim(), wallet.account);

      await waitForTransactionReceipt(config, { 
        hash: registerTx, 
        chainId: BSC_TESTNET_CHAIN_ID,
        confirmations: 2 
      });

      setSuccess(`Registration successful! Transaction: ${registerTx}`);
      setReferralCode('');
      setTimeout(() => fetchMlmData(), 1000);
    } catch (error) {
      console.error('Error registering user:', error);
      if (error.message?.includes('User rejected')) {
        setError('Transaction was cancelled by user');
      } else if (error.message?.includes('already registered')) {
        setError('Address is already registered');
      } else {
        setError(`Failed to register: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ============================
  // Withdraw Stake
  // ============================
  const handleWithdrawStake = async (index) => {
    if (!wallet.isConnected || !wallet.account) {
      setError('Please connect your wallet to withdraw.');
      return;
    }

    if (chainId !== BSC_TESTNET_CHAIN_ID) {
      try {
        await switchChain({ chainId: BSC_TESTNET_CHAIN_ID });
      } catch (error) {
        setError('Please switch to BSC Testnet.');
        return;
      }
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const stakeToWithdraw = stakes.find((s) => s.index === index);

      if (!stakeToWithdraw) {
        setError('Stake not found. Please refresh and try again.');
        return;
      }

      if (stakeToWithdraw.claimable <= 0) {
        setError('No rewards available to claim for this stake.');
        return;
      }

      setSuccess(`Initiating withdrawal of ${stakeToWithdraw.claimable.toFixed(4)} USDT...`);

      const txHash = await dwcContractInteractions.withdraw(BigInt(index), wallet.account);

      setSuccess('Transaction submitted! Waiting for confirmation...');
      await waitForTransactionReceipt(config, { 
        hash: txHash, 
        chainId: BSC_TESTNET_CHAIN_ID,
        confirmations: 2 
      });

      setSuccess(`Successfully withdrawn ${stakeToWithdraw.claimable.toFixed(4)} USDT! Transaction: ${txHash}`);

      setTimeout(() => fetchMlmData(), 1000);
    } catch (error) {
      console.error('=== WITHDRAWAL ERROR ===', error);

      if (error.message?.includes('User rejected') || error.message?.includes('cancelled')) {
        setError('Transaction was cancelled by user');
      } else if (error.message?.includes('insufficient funds') || error.message?.includes('Insufficient BNB')) {
        setError('Insufficient BNB for gas fees. Please add BNB to your wallet.');
      } else if (error.message?.includes('No rewards available')) {
        setError('No rewards available to claim for this stake.');
      } else if (error.message?.includes('User not found') || error.message?.includes('not registered')) {
        setError('Registration issue detected. Please try refreshing the page or re-registering.');
      } else {
        setError(`Withdrawal failed: ${error.message || 'Unknown error occurred'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ============================
  // UI Renders
  // ============================
  if (!wallet.isConnected) {
    return (
      <Container maxWidth="xl" sx={{ py: 2, background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', minHeight: '100vh' }}>
        <Alert severity="warning">Please connect your wallet to view the dashboard.</Alert>
      </Container>
    );
  }

  if (isLoading && !mlmData.totalInvestment) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const registrationAlert = notRegistered ? (
    <Alert
      severity="warning"
      sx={{ 
        mb: 2,
        backgroundColor: '#2d1b00',
        border: '2px solid #ff9800',
        '& .MuiAlert-icon': {
          color: '#ff9800',
        },
        '& .MuiAlert-message': {
          color: '#ffffff',
          fontWeight: 'bold',
        },
        '& .MuiAlert-action': {
          padding: { xs: '8px 0 0 0', sm: '8px 0 0 16px' },
          alignItems: { xs: 'stretch', sm: 'center' },
        }
      }}
      action={
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%'
        }}>
          <TextField
            size="small"
            label="Referral Address *"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="Enter referral address"
            required
            error={!referralCode.trim()}
            helperText={!referralCode.trim() ? "Required field" : ""}
            sx={{ 
              width: { xs: '100%', sm: '280px' },
              minWidth: { xs: 'auto', sm: '280px' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1a1a1a',
                '& fieldset': {
                  borderColor: !referralCode.trim() ? '#f44336' : '#ff9800',
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: !referralCode.trim() ? '#f44336' : '#ffb74d',
                },
                '&.Mui-focused fieldset': {
                  borderColor: !referralCode.trim() ? '#f44336' : '#ff9800',
                },
              },
              '& .MuiInputLabel-root': {
                color: !referralCode.trim() ? '#f44336' : '#ff9800',
                fontWeight: 'bold',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
              '& .MuiOutlinedInput-input': {
                color: '#ffffff',
                fontWeight: '500',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#ffb74d',
                opacity: 1,
                fontWeight: '500',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
              '& .MuiFormHelperText-root': {
                color: '#f44336',
                fontWeight: 'bold',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }
            }}
          />
          <Button
            size="small"
            startIcon={<PersonAddIcon />}
            onClick={handleRegister}
            disabled={isLoading || !referralCode.trim()}
            sx={{ 
              color: '#ffffff',
              backgroundColor: !referralCode.trim() ? '#666666' : '#ff9800',
              borderColor: !referralCode.trim() ? '#666666' : '#ff9800',
              fontWeight: 'bold',
              width: { xs: '100%', sm: 'auto' },
              minWidth: { xs: 'auto', sm: '120px' },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              '&:hover': {
                backgroundColor: !referralCode.trim() ? '#666666' : '#ffb74d',
                borderColor: !referralCode.trim() ? '#666666' : '#ffb74d'
              },
              '&:disabled': {
                backgroundColor: '#666666',
                borderColor: '#666666',
                color: '#999999'
              }
            }}
            variant="contained"
          >
            Register
          </Button>
        </Box>
      }
    >
      <Typography variant="body1" sx={{ 
        fontWeight: 'bold', 
        color: '#ffffff',
        fontSize: { xs: '0.875rem', sm: '1rem' }
      }}>
        Registration Required
      </Typography>
      <Typography variant="body2" sx={{ 
        color: '#ffb74d', 
        mt: 1,
        fontSize: { xs: '0.75rem', sm: '0.875rem' }
      }}>
        Enter referral address to continue
      </Typography>
    </Alert>
  ) : null;

  return (
    <Container maxWidth="xl" sx={{ py: 2, background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', minHeight: '100vh' }}>
      {registrationAlert}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold' }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
            Manage your investments and team performance
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchMlmData}
          disabled={isLoading}
          sx={{ 
            borderColor: '#ffffff',
            color: '#ffffff',
            '&:hover': {
              borderColor: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <PerformanceOverview
            mlmData={mlmData}
            stakes={stakes}
            notRegistered={notRegistered}
            handleWithdrawStake={handleWithdrawStake}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <PackagePurchase
            notRegistered={notRegistered}
            packages={packages}
            packageDetails={packageDetails}
            isLoading={isLoading}
            setError={setError}
            setSuccess={setSuccess}
            setIsLoading={setIsLoading}
            wallet={wallet}
            chainId={chainId}
            switchChain={switchChain}
            fetchMlmData={fetchMlmData}
          />
          <ReferralSection wallet={wallet} setSuccess={setSuccess} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;