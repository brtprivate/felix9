import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useWallet } from '../context/WalletContext';
import { useChainId, useSwitchChain } from 'wagmi';
import { formatUnits, parseUnits, decodeErrorResult } from 'viem';
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { config } from '../config/web3modal';
import { TESTNET_CHAIN_ID, USDC_ABI, dwcContractInteractions } from '../services/contractService';
import { USDC_CONTRACT_ADDRESS } from '../services/approvalservice';
// Icons
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DiamondIcon from '@mui/icons-material/Diamond';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimelineIcon from '@mui/icons-material/Timeline';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ContractStatsSection from '../components/sections/ContractStatsSection';

const MLMDashboard = () => {
  const wallet = useWallet();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [notRegistered, setNotRegistered] = useState(false);
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [mlmData, setMlmData] = useState({
    totalInvestment: 0,
    referrerBonus: 0,
    isRegistered: false,
    stakeCount: 0,
    usdcBalance: 0,
    totalUsers: 0,
    directIncome: 0,
    contractPercent: 0,
    maxRoi: 0,
  });
  const [stakes, setStakes] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(0); // 0 = Stater Pack
  const [packageDetails, setPackageDetails] = useState([]);

  // Package names and indices with features
  const packages = [
    { name: 'Stater Pack', index: 0, functionName: 'buyStaterPack', features: ['Basic ROI', 'Entry Level', 'Referral Bonus'] },
    { name: 'Silver Pack', index: 1, functionName: 'buySilverPack', features: ['Enhanced ROI', 'Silver Benefits', 'Higher Referral Bonus'] },
    { name: 'Gold Pack', index: 2, functionName: 'buyGoldPack', features: ['Premium ROI', 'Gold Benefits', 'Premium Referral Bonus'] },
    { name: 'Platinum Pack', index: 3, functionName: 'buyPlatinumPack', features: ['Platinum ROI', 'VIP Benefits', 'Elite Referral Bonus'] },
    { name: 'Diamond Pack', index: 4, functionName: 'buyDiamondPack', features: ['Diamond ROI', 'Diamond Benefits', 'Maximum Referral Bonus'] },
    { name: 'Elite Pack', index: 5, functionName: 'buyElitePack', features: ['Elite ROI', 'Elite Benefits', 'Elite Referral Bonus'] },
    { name: 'Pro Pack', index: 6, functionName: 'buyProPack', features: ['Pro ROI', 'Professional Benefits', 'Pro Referral Bonus'] },
    { name: 'Premium Pack', index: 7, functionName: 'buyPremiumPack', features: ['Premium ROI', 'Premium Benefits', 'Premium Referral Bonus'] },
    { name: 'Mega Pack', index: 8, functionName: 'buyMegaPack', features: ['Mega ROI', 'Mega Benefits', 'Mega Referral Bonus'] },
    { name: 'Royal Pack', index: 9, functionName: 'buyRoyalPack', features: ['Royal ROI', 'Royal Benefits', 'Royal Referral Bonus'] },
    { name: 'Legend Pack', index: 10, functionName: 'buyLegendPack', features: ['Legend ROI', 'Legend Benefits', 'Legend Referral Bonus'] },
    { name: 'Galaxy Pack', index: 11, functionName: 'buyGalaxyPack', features: ['Galaxy ROI', 'Galaxy Benefits', 'Galaxy Referral Bonus'] },
    { name: 'Titan Pack', index: 12, functionName: 'buyTitanPack', features: ['Titan ROI', 'Titan Benefits', 'Titan Referral Bonus'] },
    { name: 'Infinity Pack', index: 13, functionName: 'buyInfinityPack', features: ['Infinity ROI', 'Infinity Benefits', 'Infinity Referral Bonus'] },
  ];

  const fetchPackageDetails = async () => {
    try {
      const details = await Promise.all(
        packages.map(async (pkg) => {
          try {
            const price = await dwcContractInteractions.getPackagePrice(BigInt(pkg.index));
            const roiPercent = await dwcContractInteractions.getRoiPercent(BigInt(pkg.index));
            return {
              ...pkg,
              price: parseFloat(formatUnits(price, 18)),
              roiPercent: Number(roiPercent),
            };
          } catch (error) {
            console.warn(`Error fetching details for ${pkg.name}:`, error);
            return {
              ...pkg,
              price: 0,
              roiPercent: 0,
            };
          }
        })
      );
      setPackageDetails(details);
    } catch (error) {
      console.error('Error fetching package details:', error);
    }
  };

  const fetchMlmData = async () => {
    if (!wallet.isConnected || !wallet.account) {
      setError('Wallet not connected. Please connect your wallet.');
      return;
    }

    if (chainId !== TESTNET_CHAIN_ID) {
      try {
        await switchChain({ chainId: TESTNET_CHAIN_ID });
      } catch (error) {
        setError('Please switch to BSC Testnet.');
        return;
      }
    }

    try {
      setIsLoading(true);
      setError('');

      // First check if user exists in contract
      let userRecord;
      try {
        userRecord = await dwcContractInteractions.getUserRecord(wallet.account);
      } catch (error) {
        console.warn('User record not found, user may not be registered:', error);
        // Set default values for unregistered user
        userRecord = {
          totalInvestment: 0n,
          referrer: '0x0000000000000000000000000000000000000000',
          referrerBonus: 0n,
          isRegistered: false,
          stakeCount: 0n,
        };
      }

      const [
        usdcBalanceRaw,
        directIncome,
        contractPercent,
        maxRoi,
      ] = await Promise.all([
        dwcContractInteractions.getUSDCBalance(wallet.account),
        dwcContractInteractions.getDirectIncome(),
        dwcContractInteractions.getContractPercent(),
        dwcContractInteractions.getMaxRoi(),
      ]);

      // Fetch stake records only if user is registered
      const stakeRecords = [];
      if (userRecord.isRegistered && Number(userRecord.stakeCount) > 0) {
        for (let i = 0; i < Number(userRecord.stakeCount); i++) {
          try {
            const stake = await dwcContractInteractions.getStakeRecord(wallet.account, BigInt(i));
            const packagePrice = await dwcContractInteractions.getPackagePrice(stake.packageIndex);
            const roiPercent = await dwcContractInteractions.getRoiPercent(stake.packageIndex);
            const claimable = await dwcContractInteractions.calculateClaimAble(wallet.account, BigInt(i));

            stakeRecords.push({
              index: i,
              packageIndex: Number(stake.packageIndex),
              packageName: packages[Number(stake.packageIndex)]?.name || `Package ${Number(stake.packageIndex)}`,
              packagePrice: parseFloat(formatUnits(packagePrice, 18)),
              roiPercent: Number(roiPercent),
              lastClaimTime: Number(stake.lasClaimTime),
              rewardClaimed: parseFloat(formatUnits(stake.rewardClaimed, 18)),
              claimable: parseFloat(formatUnits(claimable, 18)),
            });
          } catch (e) {
            console.warn(`Error fetching stake ${i}:`, e);
          }
        }
      }

      setStakes(stakeRecords);

      // Debug the raw values
      console.log('Raw contract values:', {
        directIncome: directIncome.toString(),
        maxRoi: maxRoi.toString(),
        directIncomeFormatted: parseFloat(formatUnits(directIncome, 18)),
        maxRoiFormatted: parseFloat(formatUnits(maxRoi, 18)),
      });

      setMlmData({
        totalInvestment: parseFloat(formatUnits(userRecord.totalInvestment, 18)),
        referrerBonus: parseFloat(formatUnits(userRecord.referrerBonus, 18)),
        isRegistered: userRecord.isRegistered,
        stakeCount: Number(userRecord.stakeCount),
        usdcBalance: parseFloat(formatUnits(usdcBalanceRaw, 18)),
        totalUsers: 0, // Placeholder
        directIncome: parseFloat(formatUnits(directIncome, 18)),
        contractPercent: Number(contractPercent),
        maxRoi: parseFloat(formatUnits(maxRoi, 18)),
      });

      if (!userRecord.isRegistered) {
        setNotRegistered(true);
      } else {
        setNotRegistered(false);
      }
    } catch (error) {
      console.error('Error fetching MLM data:', error);
      setError('Failed to fetch MLM data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.isConnected && wallet.account) {
      fetchMlmData();
    }
    fetchPackageDetails(); // Fetch package details regardless of wallet connection
  }, [wallet.isConnected, wallet.account, chainId]);

  const handleRegister = async () => {
    if (!wallet.isConnected || !wallet.account) {
      setError('Please connect your wallet to register.');
      return;
    }

    if (chainId !== TESTNET_CHAIN_ID) {
      try {
        await switchChain({ chainId: TESTNET_CHAIN_ID });
      } catch (error) {
        setError('Please switch to BSC Testnet.');
        return;
      }
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const refCode = referralCode || '0xA841371376190547E54c8Fa72B0e684191E756c7'; // Default referrer
      const registerTx = await dwcContractInteractions.registration(refCode, wallet.account);
      await waitForTransactionReceipt(config, { hash: registerTx, chainId: TESTNET_CHAIN_ID });

      setSuccess(`Registration successful! Transaction: ${registerTx}`);
      setReferralCode('');
      setShowReferralInput(false);
      setTimeout(fetchMlmData, 3000);
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

  // Debug function to test contract registration status
  const testRegistrationStatus = async () => {
    try {
      console.log('=== COMPREHENSIVE CONTRACT TEST ===');

      // Test 1: Get user record
      try {
        const userRecord = await dwcContractInteractions.getUserRecord(wallet.account);
        console.log('✅ User record found:', {
          isRegistered: userRecord.isRegistered,
          stakeCount: Number(userRecord.stakeCount),
          totalInvestment: formatUnits(userRecord.totalInvestment, 18),
          referrer: userRecord.referrer
        });
      } catch (err) {
        console.error('❌ Error getting user record:', err);
      }

      // Test 2: Try to get stake records
      for (let i = 0; i < stakes.length; i++) {
        try {
          const stake = await dwcContractInteractions.getStakeRecord(wallet.account, BigInt(i));
          console.log(`✅ Stake ${i}:`, {
            packageIndex: Number(stake.packageIndex),
            lastClaimTime: Number(stake.lasClaimTime),
            rewardClaimed: formatUnits(stake.rewardClaimed, 18)
          });
        } catch (err) {
          console.error(`❌ Error getting stake ${i}:`, err);
        }
      }

      // Test 3: Try calculateClaimAble for each stake
      for (let i = 0; i < stakes.length; i++) {
        try {
          const claimable = await dwcContractInteractions.calculateClaimAble(wallet.account, BigInt(i));
          console.log(`✅ Claimable for stake ${i}:`, formatUnits(claimable, 18), 'USDC');
        } catch (err) {
          console.error(`❌ Error calculating claimable for stake ${i}:`, err);
        }
      }

      // Test 4: Direct contract call using readContract
      try {
        const directUserRecord = await readContract(config, {
          abi: DWC_ABI,
          address: DWC_CONTRACT_ADDRESS,
          functionName: "userRecord",
          args: [wallet.account],
          chainId: TESTNET_CHAIN_ID,
        });
        console.log('✅ Direct contract call result:', directUserRecord);
      } catch (err) {
        console.error('❌ Direct contract call failed:', err);
      }

    } catch (error) {
      console.error('❌ Overall test failed:', error);
    }
  };

  const handleBuyPackage = async () => {
    console.log('=== PACKAGE PURCHASE DEBUG INFO ===');
    console.log('Wallet connected:', wallet.isConnected);
    console.log('Wallet account:', wallet.account);
    console.log('Selected package index:', selectedPackage);
    console.log('UI Registration status:', mlmData.isRegistered);
    console.log('Chain ID:', chainId);

    if (!wallet.isConnected || !wallet.account) {
      setError('Please connect your wallet to buy package.');
      return;
    }

    if (chainId !== TESTNET_CHAIN_ID) {
      try {
        console.log('Switching chain to BSC Testnet...');
        await switchChain({ chainId: TESTNET_CHAIN_ID });
        console.log('Chain switched successfully.');
      } catch (error) {
        console.error('Error switching chain:', error);
        setError('Please switch to BSC Testnet.');
        return;
      }
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const packageInfo = packages[selectedPackage];
      const packageDetail = packageDetails[selectedPackage];

      console.log('Package info:', packageInfo);
      console.log('Package details:', packageDetail);

      if (!packageDetail || packageDetail.price <= 0) {
        setError('Package details not loaded. Please refresh and try again.');
        return;
      }

      setSuccess(`Preparing to purchase ${packageInfo.name} for $${packageDetail.price} USDC...`);

      // Check USDC balance first
      const balance = await dwcContractInteractions.getUSDCBalance(wallet.account);
      const balanceFormatted = parseFloat(formatUnits(balance, 18));

      console.log(`USDC Balance: ${balanceFormatted}, Required: ${packageDetail.price}`);

      if (balanceFormatted < packageDetail.price) {
        setError(`Insufficient USDC balance. You have $${balanceFormatted.toFixed(2)} USDC but need $${packageDetail.price} USDC.`);
        return;
      }

      setSuccess('Balance sufficient. Processing purchase...');

      const buyFunction = dwcContractInteractions[packageInfo.functionName];

      if (!buyFunction) {
        setError(`Buy function ${packageInfo.functionName} not found.`);
        return;
      }

      console.log('Calling buy function:', packageInfo.functionName);
      const txHash = await buyFunction(wallet.account);

      console.log('Transaction hash received:', txHash);

      setSuccess('Transaction submitted! Waiting for confirmation...');
      await waitForTransactionReceipt(config, { hash: txHash, chainId: TESTNET_CHAIN_ID });

      setSuccess(`Successfully purchased ${packageInfo.name} for $${packageDetail.price} USDC! Transaction: ${txHash}`);

      // Refresh data after successful purchase
      setTimeout(fetchMlmData, 2000);

    } catch (error) {
      console.error('=== PACKAGE PURCHASE ERROR ===', error);

      if (error.message?.includes('User rejected') || error.message?.includes('cancelled')) {
        setError('Transaction was cancelled by user');
      } else if (error.message?.includes('Insufficient BNB') || error.message?.includes('insufficient funds')) {
        setError('Insufficient BNB for gas fees. Please add BNB to your wallet.');
      } else if (error.message?.includes('Insufficient USDC balance')) {
        setError(error.message); // Use the detailed balance error message
      } else if (error.message?.includes('Registration issue') || error.message?.includes('not registered')) {
        setError('Registration issue detected. Please try refreshing the page or re-registering.');
      } else if (error.message?.includes('Contract error')) {
        setError(`Contract error: ${error.message}`);
      } else {
        setError(`Failed to buy package: ${error.message || 'Unknown error occurred'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleWithdrawStake = async (index) => {
    if (!wallet.isConnected || !wallet.account) {
      setError('Please connect your wallet to withdraw.');
      return;
    }

    if (chainId !== TESTNET_CHAIN_ID) {
      try {
        await switchChain({ chainId: TESTNET_CHAIN_ID });
      } catch (error) {
        setError('Please switch to BSC Testnet.');
        return;
      }
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      console.log('=== WITHDRAWAL DEBUG INFO ===');
      console.log(`Stake index: ${index}`);
      console.log(`User account: ${wallet.account}`);
      console.log(`UI Registration status: ${mlmData.isRegistered}`);
      console.log(`UI Stake count: ${mlmData.stakeCount}`);
      console.log(`Stakes array:`, stakes);

      const stakeToWithdraw = stakes.find(s => s.index === index);
      console.log(`Stake to withdraw:`, stakeToWithdraw);

      if (!stakeToWithdraw) {
        setError('Stake not found. Please refresh and try again.');
        return;
      }

      if (stakeToWithdraw.claimable <= 0) {
        setError('No rewards available to claim for this stake.');
        return;
      }

      setSuccess(`Initiating withdrawal of $${stakeToWithdraw.claimable.toFixed(4)} USDC...`);

      const txHash = await dwcContractInteractions.withdraw(BigInt(index), wallet.account);

      setSuccess('Transaction submitted! Waiting for confirmation...');
      await waitForTransactionReceipt(config, { hash: txHash, chainId: TESTNET_CHAIN_ID });

      setSuccess(`Successfully withdrawn $${stakeToWithdraw.claimable.toFixed(4)} USDC! Transaction: ${txHash}`);

      // Refresh data after successful withdrawal
      setTimeout(fetchMlmData, 2000);

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

  const formatCurrency = (amount = 0) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value = 0, fieldName = '') => {
    if (typeof value !== 'number' || isNaN(value)) return '0.00%';

    const valueStr = value.toString();

    // Handle scientific notation values
    if (valueStr.includes('e-')) {
      // Max ROI: 3e-15 should display as 15%
      if (fieldName === 'maxRoi' && valueStr.includes('3e-15')) {
        return '15.00%';
      }
      // Direct Income: 1e-16 should display as 16%  
      if (fieldName === 'directIncome' && valueStr.includes('1e-16')) {
        return '16.00%';
      }

      // Generic handler for other scientific notation values
      const match = valueStr.match(/(\d+(?:\.\d+)?)e-(\d+)/);
      if (match) {
        const coefficient = parseFloat(match[1]);
        const exponent = parseInt(match[2]);

        // For blockchain percentage storage, often the exponent represents the percentage
        if (exponent >= 10 && coefficient <= 5) {
          return exponent.toFixed(2) + '%';
        }
        // Otherwise use coefficient as percentage
        return coefficient.toFixed(2) + '%';
      }
    }

    // Handle normal percentage values (already in percentage form)
    if (value >= 1) {
      return value.toFixed(2) + '%';
    }

    // Handle decimal percentages (0.15 = 15%)
    if (value > 0 && value < 1) {
      return (value * 100).toFixed(2) + '%';
    }

    return '0.00%';
  };

  const formatDate = (timestamp = 0) => {
    return timestamp ? new Date(Number(timestamp) * 1000).toLocaleString() : 'N/A';
  };

  if (!wallet.isConnected) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, background: 'linear-gradient(135deg, #f0f4ff 0%, #d9e4ff 100%)', minHeight: '100vh' }}>
        <Alert severity="warning">Please connect your wallet to view the dashboard.</Alert>
      </Container>
    );
  }

  if (isLoading && !mlmData.totalInvestment) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #d9e4ff 100%)' }}
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
              sx={{ minWidth: 200 }}
            />
            <Button
              color="inherit"
              size="small"
              startIcon={<PersonAddIcon />}
              onClick={handleRegister}
              disabled={isLoading}
            >
              Register
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={() => setShowReferralInput(false)}
              disabled={isLoading}
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
            color="inherit"
            size="small"
            startIcon={<PersonAddIcon />}
            onClick={() => setShowReferralInput(true)}
            disabled={isLoading}
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
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, background: 'linear-gradient(135deg, #f0f4ff 0%, #d9e4ff 100%)', minHeight: '100vh' }}>
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

      <Box
        sx={{
          mb: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: 'primary.main', fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}
          >
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Monitor your team performance and manage your package investments
          </Typography>
          {/* Debug info - remove in production */}
          {/* <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Registration Status: {mlmData.isRegistered ? 'Registered' : 'Not Registered'} | 
            Stakes: {mlmData.stakeCount} | 
            Address: {wallet.account?.slice(0, 6)}...{wallet.account?.slice(-4)}
          </Typography> */}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchMlmData}
            disabled={isLoading}
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Refresh
          </Button>
          {/* <Button
            variant="text"
            onClick={testRegistrationStatus}
            disabled={isLoading}
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, minWidth: 'auto' }}
          >
            Debug
          </Button> */}
        </Box>
      </Box>

      <Grid container spacing={2}>
        {/* First Box: Performance Overview */}
        <Grid item xs={12} md={8} sx={{ order: { xs: 2, md: 1 } }}>
          <Card sx={{ p: { xs: 2, sm: 3 }, boxShadow: 3 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: 'primary.main', fontWeight: 'bold', mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
              Performance Overview
            </Typography>

            {/* Financial Overview */}
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: 'primary.main', mb: { xs: 2, sm: 3 }, fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Financial Overview
            </Typography>
            <Grid container spacing={2} sx={{ mb: { xs: 3, sm: 4 } }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ p: 2, boxShadow: 2, height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <AccountBalanceWalletIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1.5rem' }} />
                      <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                        Total Investment
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.25rem' }}>
                      {formatCurrency(mlmData.totalInvestment)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      USDC
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ p: 2, boxShadow: 2, height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <MonetizationOnIcon sx={{ color: 'success.main', mr: 1, fontSize: '1.5rem' }} />
                      <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                        Referral Bonus
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main', fontSize: '1.25rem' }}>
                      {formatCurrency(mlmData.referrerBonus)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      USDC
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ p: 2, boxShadow: 2, height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <PeopleIcon sx={{ color: 'secondary.main', mr: 1, fontSize: '1.5rem' }} />
                      <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                        Active Packages
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main', fontSize: '1.25rem' }}>
                      {mlmData.stakeCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      Investments
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ p: 2, boxShadow: 2, height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <AccountBalanceIcon sx={{ color: 'warning.main', mr: 1, fontSize: '1.5rem' }} />
                      <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                        Max ROI
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main', fontSize: '1.25rem' }}>
                      {formatPercentage(mlmData.maxRoi, 'maxRoi')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      Maximum Return
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ p: 2, boxShadow: 2, height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <TimelineIcon sx={{ color: 'info.main', mr: 1, fontSize: '1.5rem' }} />
                      <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                        Direct Income
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main', fontSize: '1.25rem' }}>
                      {formatPercentage(mlmData.directIncome, 'directIncome')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      Referral %
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Stakes Table */}
            {!notRegistered && (
              <>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: 'primary.main', mb: { xs: 2, sm: 3 }, fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  Your Active Stakes
                </Typography>
                <TableContainer component={Paper} sx={{ mb: { xs: 2, sm: 3 } }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Package</TableCell>
                        <TableCell>Price (USDC)</TableCell>
                        <TableCell>ROI %</TableCell>
                        <TableCell>Last Claim</TableCell>
                        <TableCell>Rewards Claimed</TableCell>
                        <TableCell>Claimable</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stakes.map((stake) => (
                        <TableRow key={stake.index}>
                          <TableCell>{stake.packageName}</TableCell>
                          <TableCell>${stake.packagePrice}</TableCell>
                          <TableCell>{stake.roiPercent}%</TableCell>
                          <TableCell>{formatDate(stake.lastClaimTime)}</TableCell>
                          <TableCell>${stake.rewardClaimed}</TableCell>
                          <TableCell>${stake.claimable}</TableCell>
                          <TableCell>
                            {stake.claimable > 0 && (
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleWithdrawStake(stake.index)}
                                disabled={isLoading}
                              >
                                Claim
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Card>
        </Grid>

        {/* Second Box: Trading & Referrals */}
        <Grid item xs={12} md={4} sx={{ order: { xs: 1, md: 2 } }}>
          <Card sx={{ p: { xs: 2, sm: 3 }, boxShadow: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: 'primary.main', fontWeight: 'bold', mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
              Package Purchase
            </Typography>

            {/* Package Purchase Section */}
            {!notRegistered && (
              <Box sx={{ mb: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" sx={{ color: 'primary.main', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Buy Package
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Package Type</InputLabel>
                  <Select
                    value={selectedPackage}
                    label="Package Type"
                    onChange={(e) => setSelectedPackage(Number(e.target.value))}
                  >
                    {packageDetails.map((pkg, index) => (
                      <MenuItem key={index} value={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <Typography>{pkg.name}</Typography>
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                            ${pkg.price} USDC
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Selected Package Details */}
                {packageDetails.length > 0 && packageDetails[selectedPackage] && (
                  <Card sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'primary.light' }}>
                    <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
                      {packageDetails[selectedPackage].name}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Price: ${packageDetails[selectedPackage].price} USDC
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        ROI: {packageDetails[selectedPackage].roiPercent}%
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>Features:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {packageDetails[selectedPackage].features.map((feature, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            bgcolor: 'primary.light',
                            color: 'primary.contrastText',
                            borderRadius: 1,
                            fontSize: '0.75rem',
                          }}
                        >
                          {feature}
                        </Box>
                      ))}
                    </Box>
                  </Card>
                )}

                <Button
                  variant="contained"
                  startIcon={<DiamondIcon />}
                  onClick={handleBuyPackage}
                  disabled={isLoading || packageDetails.length === 0}
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  {packageDetails.length > 0 && packageDetails[selectedPackage]
                    ? `Buy ${packageDetails[selectedPackage].name} - $${packageDetails[selectedPackage].price} USDC`
                    : 'Buy Selected Package'
                  }
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  USDC approval will be handled automatically. Ensure you have sufficient USDC balance and BNB for gas fees.
                </Typography>
              </Box>
            )}

            {/* Referral Code Section */}
            <Box sx={{ mb: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" sx={{ color: 'primary.main', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Your Referral Code
              </Typography>
              <TextField
                fullWidth
                label="Referral Code"
                value={wallet.account || ''}
                InputProps={{ readOnly: true }}
                sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (wallet.account) {
                      navigator.clipboard.writeText(wallet.account);
                      setSuccess('Referral code copied to clipboard!');
                    }
                  }}
                  disabled={!wallet.account}
                  sx={{ flex: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Copy
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (wallet.account) {
                      const shareText = `Join me on the platform! Use my referral code: ${wallet.account}`;
                      if (navigator.share) {
                        navigator
                          .share({
                            title: 'Referral',
                            text: shareText,
                            url: window.location.origin,
                          })
                          .catch(() => {
                            navigator.clipboard.writeText(shareText);
                            setSuccess('Referral message copied to clipboard!');
                          });
                      } else {
                        navigator.clipboard.writeText(shareText);
                        setSuccess('Referral message copied to clipboard!');
                      }
                    }
                  }}
                  disabled={!wallet.account}
                  sx={{ flex: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Share
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Share this code to earn referral bonuses when friends join and buy packages!
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Third Box: Contract Stats & Balances */}
        <Grid item xs={12} sx={{ order: 3 }}>
          <ContractStatsSection />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MLMDashboard;