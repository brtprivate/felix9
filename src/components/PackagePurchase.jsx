import React, { useState } from 'react';
import {
  Card,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import DiamondIcon from '@mui/icons-material/Diamond';
import { formatUnits } from 'viem';
import { BSC_TESTNET_CHAIN_ID, dwcContractInteractions } from '../services/contractService';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '../config/web3modal';

const PackagePurchase = ({ notRegistered, packages, packageDetails, isLoading, setError, setSuccess, setIsLoading, wallet, chainId, switchChain, fetchMlmData }) => {
  const [selectedPackage, setSelectedPackage] = useState(0); // Array index (0-based, maps to package index)

  const handleBuyPackage = async () => {
    console.log('=== PACKAGE PURCHASE DEBUG INFO ===');
    console.log('Wallet connected:', wallet.isConnected);
    console.log('Wallet account:', wallet.account);
    console.log('Selected package array index:', selectedPackage);
    console.log('Selected package contract index:', packages[selectedPackage]?.index);
    console.log('UI Registration status:', !notRegistered);
    console.log('Chain ID:', chainId);

    if (!wallet.isConnected || !wallet.account) {
      setError('Please connect your wallet to buy package.');
      return;
    }
    if (chainId !== BSC_TESTNET_CHAIN_ID) {
      try {
        console.log('Switching chain to BSC Testnet...');
        await switchChain({ chainId: BSC_TESTNET_CHAIN_ID });
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

      setSuccess(`Preparing to purchase ${packageInfo.name} for $${packageDetail.price} USDT...`);

      const balance = await dwcContractInteractions.getUSDTBalance(wallet.account);
      const balanceFormatted = parseFloat(formatUnits(balance, 18));

      console.log(`USDT Balance: ${balanceFormatted}, Required: ${packageDetail.price}`);

      // if (balanceFormatted < packageDetail.price) {
      //   setError(`Insufficient USDT balance. You have $${balanceFormatted.toFixed(2)} USDT but need $${packageDetail.price} USDT.`);
      //   return;
      // }

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
      await waitForTransactionReceipt(config, { hash: txHash, chainId: BSC_TESTNET_CHAIN_ID });

      setSuccess(`Successfully purchased ${packageInfo.name} for $${packageDetail.price} USDT! Transaction: ${txHash}`);

      setTimeout(fetchMlmData, 2000);
    } catch (error) {
      console.error('=== PACKAGE PURCHASE ERROR ===', error);

      if (error.message?.includes('User rejected') || error.message?.includes('cancelled')) {
        setError('Transaction was cancelled by user');
      } else if (error.message?.includes('Insufficient BNB') || error.message?.includes('insufficient funds')) {
        setError('Insufficient BNB for gas fees. Please add BNB to your wallet.');
      } else if (error.message?.includes('Insufficient USDT balance')) {
        setError(error.message);
      } else if (error.message?.includes('Registration issue') || error.message?.includes('not registered')) {
        setError('Registration issue detected. Please try refreshing the page or re-registering.');
      } else {
        setError(`Failed to buy package: ${error.message || 'Unknown error occurred'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ 
      p: { xs: 2, sm: 3 }, 
      boxShadow: 3, 
      display: 'flex', 
      flexDirection: 'column', 
      mb: 2,
      backgroundColor: '#2a2a2a',
      border: '1px solid #3a3a3a'
    }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: '#ffffff', fontWeight: 'bold', mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
      >
        Package Purchase
      </Typography>

      {!notRegistered && (
        <Box sx={{ mb: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" sx={{ color: '#ffffff', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Buy Package
          </Typography>
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#ffffff' }}>Package Type</InputLabel>
            <Select
              value={selectedPackage}
              label="Package Type"
              onChange={(e) => setSelectedPackage(Number(e.target.value))}
              sx={{
                color: '#ffffff',
                backgroundColor: '#1e1e1e',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffffff',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffffff',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffffff',
                },
                '& .MuiSvgIcon-root': {
                  color: '#ffffff',
                },
                '& .MuiSelect-select': {
                  backgroundColor: '#1e1e1e',
                  color: '#ffffff'
                }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #3a3a3a',
                    '& .MuiMenuItem-root': {
                      backgroundColor: '#1e1e1e',
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#2a2a2a'
                      }
                    }
                  }
                }
              }}
            >
              {packageDetails.map((pkg, index) => (
                <MenuItem 
                  key={index} 
                  value={index}
                  sx={{
                    backgroundColor: '#1e1e1e',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#2a2a2a'
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#3a3a3a',
                      '&:hover': {
                        backgroundColor: '#3a3a3a'
                      }
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <Typography sx={{ color: '#ffffff' }}>{pkg.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4fc3f7' }}>
                      ${pkg.price} USDT
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {packageDetails.length > 0 && packageDetails[selectedPackage] && (
            <Card sx={{ 
              p: 2, 
              backgroundColor: '#1e1e1e', 
              border: '1px solid #3a3a3a'
            }}>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                {packageDetails[selectedPackage].name}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>
                  Price: ${packageDetails[selectedPackage].price} USDT
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                  ROI: {packageDetails[selectedPackage].roiPercent}%
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#e0e0e0' }}>Features:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {packageDetails[selectedPackage].features.map((feature, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      backgroundColor: '#3a3a3a',
                      color: '#ffffff',
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
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' },
              backgroundColor: '#00C853', // bright green
              color: '#fff', // white text
              fontWeight: 'bold',
              boxShadow: '0 0 12px rgba(0, 200, 83, 0.6)', // glowing green effect
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#00E676',
                boxShadow: '0 0 18px rgba(0, 230, 118, 0.9)',
              },
              '&:disabled': {
                backgroundColor: '#A5D6A7',
                color: '#fff',
                boxShadow: 'none',
              },
            }}
          >
            {packageDetails.length > 0 && packageDetails[selectedPackage]
              ? `Buy ${packageDetails[selectedPackage].name} - $${packageDetails[selectedPackage].price} USDT`
              : 'Buy Selected Package'}
          </Button>

          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, color: '#b0b0b0' }}>
            USDT approval will be handled automatically. Ensure you have sufficient USDT balance and BNB for gas fees.
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default PackagePurchase;