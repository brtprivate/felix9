import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  CircularProgress,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarsIcon from '@mui/icons-material/Stars';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import { formatCurrency, formatDate } from '../utils/utils';

// Utility function to format ROI
const formatROI = (roiPercent) => {
  if (typeof roiPercent !== 'number') return 'N/A';
  return `${(roiPercent / 10).toFixed(1)}%`;
};

const PerformanceOverview = ({ mlmData = {}, stakes = [], notRegistered, handleWithdrawStake, isLoading }) => {
  const [loadingStakes, setLoadingStakes] = useState({}); // Track loading state per stake index
  const [error, setError] = useState(null); // Track errors for user feedback
  console.log("mlm", mlmData);

  const handleClaimClick = async (stakeIndex) => {
    setLoadingStakes((prev) => ({ ...prev, [stakeIndex]: true }));
    setError(null); // Clear previous errors
    try {
      await handleWithdrawStake(stakeIndex);
    } catch (error) {
      console.error('Claim error:', error);
      setError('Failed to claim rewards. Please try again.');
    } finally {
      setLoadingStakes((prev) => ({ ...prev, [stakeIndex]: false }));
    }
  };

  // Split useMemo for better readability and performance
  const financialMetrics = useMemo(() => {
    const totalClaimed = stakes.reduce((sum, stake) => sum + (stake.rewardClaimed || 0), 0);
    const totalClaimable = stakes.reduce((sum, stake) => sum + (stake.claimable || 0), 0);
    const totalRewards =mlmData.totalWithdrawn  + totalClaimable;
    const earningLimit = (mlmData.totalInvestment || 0) * 3;
    const used = mlmData.totalWithdrawn + totalClaimable;
    const remaining = Math.max(0, earningLimit - used);
    const percentage = earningLimit > 0 ? Math.min(100, (used / earningLimit) * 100) : 0;

    return { totalClaimed, totalClaimable, totalRewards, earningLimit, used, remaining, percentage };
  }, [stakes, mlmData.totalInvestment]);

  if (isLoading) {
    return (
      <Card sx={{ p: { xs: 2, sm: 3 }, boxShadow: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading performance data...
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, boxShadow: 3 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: 'primary.main', fontWeight: 'bold', mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
      >
        Performance Overview
      </Typography>

      {error && (
        <Typography variant="body2" color="error.main" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

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
                {formatCurrency(mlmData.totalInvestment || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                USDT
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
                {formatCurrency(mlmData.referrerBonus || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                USDT
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
                {mlmData.stakeCount || 0}
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
                <TrendingUpIcon sx={{ color: 'info.main', mr: 1, fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                  Total Claimed
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main', fontSize: '1.25rem' }}>
                {formatCurrency(financialMetrics.totalClaimed)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 2, boxShadow: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <AccessTimeIcon sx={{ color: 'warning.main', mr: 1, fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                  Total Claimable
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main', fontSize: '1.25rem' }}>
                {formatCurrency(financialMetrics.totalClaimable)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 2, boxShadow: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <StarsIcon sx={{ color: 'error.main', mr: 1, fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                  Total Rewards
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main', fontSize: '1.25rem' }}>
                {formatCurrency(financialMetrics.totalRewards)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>

       
       
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 2, boxShadow: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <BusinessCenterIcon sx={{ color: 'info.main', mr: 1, fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                  Direct Business
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main', fontSize: '1.25rem' }}>
                {formatCurrency(mlmData.directBusiness || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 2, boxShadow: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <AccountBalanceWalletIcon sx={{ color: 'info.main', mr: 1, fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                  Referrer
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main', fontSize: '1.25rem' }}>
                {mlmData.referrer && mlmData.referrer !== '0x0000000000000000000000000000000000000000' ? `${mlmData.referrer.slice(0, 6)}...${mlmData.referrer.slice(-4)}` : 'None'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Address
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 2, boxShadow: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                  Contract Status
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main', fontSize: '1.25rem' }}>
                Active
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Operational
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {!notRegistered && (
        <>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: 'primary.main', mb: { xs: 2, sm: 3 }, fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            Your Active Stakes
          </Typography>
          {stakes.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No active stakes available.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ mb: { xs: 2, sm: 3 } }}>
              <Table size="small" aria-label="Active stakes table">
                <TableHead>
                  <TableRow>
                    <TableCell scope="col">Package</TableCell>
                    <TableCell scope="col">Price (USDT)</TableCell>
                    <TableCell scope="col">ROI %</TableCell>
                    <TableCell scope="col">Last Claim</TableCell>
                    <TableCell scope="col">Rewards Claimed</TableCell>
                    <TableCell scope="col">Claimable</TableCell>
                    <TableCell scope="col">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stakes.map((stake) => (
                    <TableRow key={stake.index}>
                      <TableCell>{stake.packageName || 'Unknown'}</TableCell>
                      <TableCell>{formatCurrency(stake.packagePrice || 0)}</TableCell>
                      <TableCell>{formatROI(stake.roiPercent)}</TableCell>
                      <TableCell>{formatDate(stake.lastClaimTime)}</TableCell>
                      <TableCell>{formatCurrency(stake.rewardClaimed || 0)}</TableCell>
                      <TableCell>{formatCurrency(stake.claimable || 0)}</TableCell>
                      <TableCell>
                        <Tooltip
                          title={
                            stake.claimable <= 0
                              ? 'No rewards available to claim'
                              : loadingStakes[stake.index]
                                ? 'Processing claim...'
                                : 'Claim available rewards'
                          }
                          aria-describedby={`claim-tooltip-${stake.index}`}
                        >
                          <span>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleClaimClick(stake.index)}
                              disabled={loadingStakes[stake.index] || stake.claimable <= 0}
                              startIcon={loadingStakes[stake.index] ? <CircularProgress size={16} /> : null}
                              color={stake.claimable <= 0 ? 'inherit' : ''}
                              sx={stake.claimable <= 0 ? { backgroundColor: 'grey.300', color: 'grey.600' } : {}}
                            >
                              {loadingStakes[stake.index] ? 'Claiming...' : stake.claimable <= 0 ? 'No Claim' : 'Claim'}
                            </Button>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Card sx={{ p: 2, boxShadow: 2, mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <MonetizationOnIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                  Earning Limit
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                {formatCurrency(financialMetrics.earningLimit)}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={financialMetrics.percentage}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: financialMetrics.percentage > 80 ? 'warning.main' : 'success.main',
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, textAlign: 'right', fontSize: '0.8rem' }}>
                  {financialMetrics.percentage.toFixed(2)}% Used
                </Typography>
              </Box>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="warning.main" sx={{ fontSize: '0.85rem' }}>
                    Used: {formatCurrency(financialMetrics.used)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="success.main" sx={{ fontSize: '0.85rem' }}>
                    Remaining: {formatCurrency(financialMetrics.remaining)}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mt: 1 }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </>
      )}
    </Card>
  );
};


export default PerformanceOverview;