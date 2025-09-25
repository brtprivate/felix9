
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
import { TESTNET_CHAIN_ID, dwcContractInteractions } from '../services/contractService';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '../config/web3modal';

const PackagePurchase = ({ notRegistered, packages, packageDetails, isLoading, setError, setSuccess, setIsLoading, wallet, chainId, switchChain, fetchMlmData }) => {
  const [selectedPackage, setSelectedPackage] = useState(0); // Array index (0-based, maps to package index 1)

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

      setTimeout(fetchMlmData, 2000);
    } catch (error) {
      console.error('=== PACKAGE PURCHASE ERROR ===', error);

      if (error.message?.includes('User rejected') || error.message?.includes('cancelled')) {
        setError('Transaction was cancelled by user');
      } else if (error.message?.includes('Insufficient BNB') || error.message?.includes('insufficient funds')) {
        setError('Insufficient BNB for gas fees. Please add BNB to your wallet.');
      } else if (error.message?.includes('Insufficient USDC balance')) {
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
    <Card sx={{ p: { xs: 2, sm: 3 }, boxShadow: 3, display: 'flex', flexDirection: 'column', mb: 2 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: 'primary.main', fontWeight: 'bold', mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
      >
        Package Purchase
      </Typography>

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
              : 'Buy Selected Package'}
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            USDC approval will be handled automatically. Ensure you have sufficient USDC balance and BNB for gas fees.
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default PackagePurchase;
