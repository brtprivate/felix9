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
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Fade,
} from '@mui/material';
import { useWallet } from '../context/WalletContext';
import { useChainId, useSwitchChain } from 'wagmi';
import { BSC_TESTNET_CHAIN_ID, dwcContractInteractions } from '../services/contractService';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

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
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const fetchReferrers = async () => {
    if (!wallet.isConnected || !wallet.account) {
      setError('Wallet not connected. Please connect your wallet.');
      return;
    }

    if (chainId !== BSC_TESTNET_CHAIN_ID) {
      try {
        await switchChain({ chainId: BSC_TESTNET_CHAIN_ID });
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

  const handleCopyAddress = () => {
    if (wallet.account) {
      navigator.clipboard.writeText(wallet.account);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleShareReferral = () => {
    if (wallet.account) {
      const shareText = `Join me on this amazing platform! Use my referral code: ${wallet.account}`;
      if (navigator.share) {
        navigator.share({
          title: 'Join the Platform',
          text: shareText,
          url: window.location.origin,
        }).catch(() => {
          navigator.clipboard.writeText(shareText);
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 2000);
        });
      } else {
        navigator.clipboard.writeText(shareText);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    }
  };

  if (!wallet.isConnected) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        color: '#ffffff'
      }}>
        <Container
          maxWidth="xl"
          sx={{ py: 2 }}
        >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          textAlign: 'center'
        }}>
          <Card sx={{
            backgroundColor: '#1e1e1e',
            border: '1px solid #3a3a3a',
            borderRadius: 3,
            p: 4,
            maxWidth: 500
          }}>
            <CardContent>
              <Avatar sx={{
                backgroundColor: '#ff9800',
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2
              }}>
                <PeopleIcon sx={{ fontSize: 40, color: '#ffffff' }} />
              </Avatar>
              <Typography variant="h5" sx={{ color: '#ffffff', mb: 2, fontWeight: 'bold' }}>
                Wallet Connection Required
              </Typography>
              <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
                Please connect your wallet to view your referral network and track your referrals.
              </Typography>
              <Alert 
                severity="warning" 
                sx={{ 
                  backgroundColor: '#2a1a1a', 
                  color: '#ffcdd2', 
                  border: '1px solid #d32f2f',
                  '& .MuiAlert-icon': {
                    color: '#ff9800'
                  }
                }}
              >
                Connect your wallet to access referral details.
              </Alert>
            </CardContent>
          </Card>
        </Box>
        </Container>
      </Box>
    );
  }

  if (isLoading && referrers.length === 0) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 2
      }}>
        <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center' }}>
          <Card sx={{
            backgroundColor: '#1e1e1e',
            border: '1px solid #3a3a3a',
            borderRadius: 3,
            p: 4,
            maxWidth: 400
          }}>
            <CardContent>
              <Avatar sx={{
                backgroundColor: '#4fc3f7',
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3
              }}>
                <PeopleIcon sx={{ fontSize: 40, color: '#ffffff' }} />
              </Avatar>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2, fontWeight: 'bold' }}>
                Loading Referral Data
              </Typography>
              <CircularProgress sx={{ color: '#4fc3f7', mb: 2 }} />
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Fetching your referral network...
              </Typography>
            </CardContent>
          </Card>
        </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      color: '#ffffff'
    }}>
      <Container
        maxWidth="xl"
        sx={{ py: 3 }}
      >
      {/* Header Section */}
      <Fade in timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ 
              color: '#ffffff', 
              fontWeight: 'bold', 
              fontSize: { xs: '1.8rem', sm: '2.5rem' },
              textAlign: 'center',
              mb: 2,
              background: 'linear-gradient(45deg, #4fc3f7, #4caf50)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Referral Network
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#b0b0b0', 
              textAlign: 'center',
              mb: 3,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Track your referral network and grow your community
          </Typography>
        </Box>
      </Fade>

      {/* Alerts */}
      {error && (
        <Fade in timeout={500}>
          <Alert 
            severity="error" 
            sx={{ mb: 3, backgroundColor: '#2a1a1a', color: '#ffcdd2', border: '1px solid #d32f2f' }} 
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        </Fade>
      )}
      {success && (
        <Fade in timeout={500}>
          <Alert 
            severity="success" 
            sx={{ mb: 3, backgroundColor: '#1a2a1a', color: '#c8e6c9', border: '1px solid #4caf50' }} 
            onClose={() => setSuccess('')}
          >
            {success}
          </Alert>
        </Fade>
      )}

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Fade in timeout={1000}>
            <Card sx={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #3a3a3a',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              height: '100%'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Avatar sx={{
                  backgroundColor: '#4fc3f7',
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 4px 20px rgba(79, 195, 247, 0.3)'
                }}>
                  <PeopleIcon sx={{ fontSize: 40, color: '#ffffff' }} />
                </Avatar>
                <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                  {referrerCount}
                </Typography>
                <Typography variant="h6" sx={{ color: '#4fc3f7', fontWeight: 600 }}>
                  Total Referrals
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0', mt: 1 }}>
                  Active network members
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={8}>
          <Fade in timeout={1200}>
            <Card sx={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #3a3a3a',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              height: '100%'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ backgroundColor: '#4caf50', mr: 2 }}>
                      <ShareIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Your Referral Code
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                        Share this code to earn rewards
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchReferrers}
                    disabled={isLoading}
                    sx={{ 
                      color: '#ffffff',
                      borderColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: '#ffffff'
                      }
                    }}
                  >
                    Refresh
                  </Button>
                </Box>

                <Box sx={{
                  backgroundColor: '#2a2a2a',
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                  border: '1px solid #3a3a3a'
                }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      color: '#e0e0e0',
                      wordBreak: 'break-all',
                      mb: 2
                    }}
                  >
                    {wallet.account || 'Connect your wallet to see referral code'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<ContentCopyIcon />}
                      onClick={handleCopyAddress}
                      disabled={!wallet.account}
                      sx={{
                        backgroundColor: copySuccess ? '#4caf50' : '#4fc3f7',
                        '&:hover': {
                          backgroundColor: copySuccess ? '#45a049' : '#29b6f6'
                        }
                      }}
                    >
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ShareIcon />}
                      onClick={handleShareReferral}
                      disabled={!wallet.account}
                      sx={{
                        color: '#ffffff',
                        borderColor: '#ffffff',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: '#ffffff'
                        }
                      }}
                    >
                      {shareSuccess ? 'Shared!' : 'Share'}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Referrals Table */}
        <Grid item xs={12}>
          <Fade in timeout={1400}>
            <Card sx={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #3a3a3a',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #3a3a3a' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ backgroundColor: '#ff9800', mr: 2 }}>
                        <EmojiEventsIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                          Referral Network
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                          Your referred users and their status
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={`${referrerCount} Members`}
                      sx={{
                        backgroundColor: '#4caf50',
                        color: '#ffffff',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                </Box>

                <TableContainer>
                  <Table sx={{ 
                    '& .MuiTableCell-head': {
                      backgroundColor: '#2a2a2a',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      fontSize: '0.95rem'
                    },
                    '& .MuiTableCell-body': {
                      color: '#e0e0e0',
                      borderBottom: '1px solid #3a3a3a'
                    },
                    '& .MuiTableRow-root:hover': {
                      backgroundColor: '#252525'
                    }
                  }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ pl: 3 }}>
                          #
                        </TableCell>
                        <TableCell>
                          Referral Address
                        </TableCell>
                        <TableCell align="center">
                          Status
                        </TableCell>
                        <TableCell align="center">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {referrers.length > 0 ? (
                        referrers.map((referrer, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row" sx={{ pl: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{
                                  backgroundColor: '#4fc3f7',
                                  width: 32,
                                  height: 32,
                                  mr: 2,
                                  fontSize: '0.875rem'
                                }}>
                                  {index + 1}
                                </Avatar>
                                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                  #{index + 1}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: 'monospace',
                                  fontSize: '0.875rem',
                                  color: '#e0e0e0',
                                  wordBreak: 'break-all'
                                }}
                              >
                                {referrer}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label="Active"
                                sx={{
                                  backgroundColor: '#4caf50',
                                  color: '#ffffff',
                                  fontWeight: 'bold',
                                  boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
                                }}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Copy Address">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    navigator.clipboard.writeText(referrer);
                                    setSuccess('Address copied to clipboard!');
                                  }}
                                  sx={{ color: '#4fc3f7' }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Avatar sx={{
                                backgroundColor: '#666666',
                                width: 80,
                                height: 80,
                                mx: 'auto',
                                mb: 2
                              }}>
                                <PeopleIcon sx={{ fontSize: 40, color: '#ffffff' }} />
                              </Avatar>
                              <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                                No Referrals Yet
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3 }}>
                                Start sharing your referral code to build your network!
                              </Typography>
                              <Button
                                variant="contained"
                                startIcon={<ShareIcon />}
                                onClick={handleShareReferral}
                                sx={{
                                  backgroundColor: '#4fc3f7',
                                  '&:hover': {
                                    backgroundColor: '#29b6f6'
                                  }
                                }}
                              >
                                Share Referral Code
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
      </Container>
    </Box>
  );
};

export default ReferralDetails;
