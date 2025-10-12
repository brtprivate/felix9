import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Alert,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { useWallet } from '../context/WalletContext';
import { useChainId, useSwitchChain } from 'wagmi';
import { MAINNET_CHAIN_ID, dwcContractInteractions } from '../services/contractService';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';

const ReferralDetails = () => {
  const wallet = useWallet();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [referrers, setReferrers] = useState([]);
  const [referrerCount, setReferrerCount] = useState(0);
  const [notRegistered, setNotRegistered] = useState(false);

  const fetchReferrers = async () => {
    if (!wallet.isConnected || !wallet.account) {
      setError('Wallet not connected. Please connect your wallet.');
      return;
    }

    if (chainId !== MAINNET_CHAIN_ID) {
      try {
        await switchChain({ chainId: MAINNET_CHAIN_ID });
      } catch (error) {
        setError('Please switch to BSC Mainnet.');
        return;
      }
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      // Check if user is registered
      const userRecord = await dwcContractInteractions.getUserRecord(wallet.account);
      if (!userRecord.isRegistered) {
        setNotRegistered(true);
        setError('You need to register to view your referrals.');
        return;
      }

      setNotRegistered(false);

      // Fetch referrers
      const result = await dwcContractInteractions.getUserReferrers(wallet.account);
      console.log('Referrers:', result);

      setReferrers(result.referrers || []);
      setReferrerCount(Number(result.count) || 0);

      setSuccess('Referral data loaded successfully.');
    } catch (error) {
      console.error('Error fetching referrers:', error);
      setError('Failed to fetch referral data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.isConnected && wallet.account) {
      fetchReferrers();
    }
  }, [wallet.isConnected, wallet.account, chainId]);

  if (!wallet.isConnected) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: 2, background: 'linear-gradient(135deg, #f0f4ff 0%, #d9e4ff 100%)', minHeight: '100vh' }}
      >
        <Alert severity="warning">Please connect your wallet to view referral details.</Alert>
      </Container>
    );
  }

  if (isLoading && referrers.length === 0) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          py: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f0f4ff 0%, #d9e4ff 100%)',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 2, background: 'linear-gradient(135deg, #f0f4ff 0%, #d9e4ff 100%)', minHeight: '100vh' }}
    >
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
          mb: 3,
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
            Referral Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View the users you have referred to the platform
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchReferrers}
          disabled={isLoading}
          sx={{ width: { xs: '100%', sm: 'auto' }, fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Total Referrals: {referrerCount}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="referrals table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                    #
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                    Referral Address
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }} align="center">
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {referrers.length > 0 ? (
                  referrers.map((referrer, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                    >
                      <TableCell component="th" scope="row">
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            wordBreak: 'break-all',
                          }}
                        >
                          {referrer}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label="Referred"
                          color="success"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No referrals found. Start referring users to see them here!
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReferralDetails;
