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
  const [showReferralInput, setShowReferralInput] = useState(false);
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

      const refCode = referralCode || '0xA841371376190547E54c8Fa72B0e684191E756c7'; // fallback referrer
      const registerTx = await dwcContractInteractions.registration(refCode, wallet.account);

      await waitForTransactionReceipt(config, { 
        hash: registerTx, 
        chainId: BSC_TESTNET_CHAIN_ID,
        confirmations: 2 
      });

      setSuccess(`Registration successful! Transaction: ${registerTx}`);
      setReferralCode('');
      setShowReferralInput(false);
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
    showReferralInput ? (
      <Alert
        severity="info"
        sx={{ mb: 2 }}
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              label="Referral Address (optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              sx={{ 
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#ffffff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ffffff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ffffff',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#ffffff',
                },
                '& .MuiOutlinedInput-input': {
                  color: '#ffffff',
                }
              }}
            />
            <Button
              size="small"
              startIcon={<PersonAddIcon />}
              onClick={handleRegister}
              disabled={isLoading}
              sx={{ 
                color: '#ffffff',
                borderColor: '#ffffff',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: '#ffffff'
                }
              }}
              variant="outlined"
            >
              Register
            </Button>
            <Button
              size="small"
              onClick={() => setShowReferralInput(false)}
              disabled={isLoading}
              sx={{ 
                color: '#ffffff',
                borderColor: '#ffffff',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: '#ffffff'
                }
              }}
              variant="outlined"
            >
              Cancel
            </Button>
          </Box>
        }
      >
        Enter a referral address if you have one, or leave blank to use the default.
      </Alert>
    ) : (
      <Alert
        severity="info"
        sx={{ mb: 2 }}
        action={
          <Button
            size="small"
            startIcon={<PersonAddIcon />}
            onClick={() => setShowReferralInput(true)}
            disabled={isLoading}
            sx={{ 
              color: '#ffffff',
              borderColor: '#ffffff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: '#ffffff'
              }
            }}
            variant="outlined"
          >
            Register Now
          </Button>
        }
      >
        You need to register to participate in the system. Click "Register Now" to enter a referral address (optional).
      </Alert>
    )
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
            Monitor your team performance and manage your package investments
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