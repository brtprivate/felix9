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
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarsIcon from '@mui/icons-material/Stars';
import { formatCurrency, formatDate } from '../utils/utils';

const PerformanceOverview = ({ mlmData, stakes, notRegistered, handleWithdrawStake, isLoading }) => {
  const [loadingStakes, setLoadingStakes] = useState({}); // Track loading state per stake index

  const handleClaimClick = async (stakeIndex) => {
    setLoadingStakes((prev) => ({ ...prev, [stakeIndex]: true }));
    try {
      await handleWithdrawStake(stakeIndex, () =>
        setLoadingStakes((prev) => ({ ...prev, [stakeIndex]: false }))
      );
    } catch (error) {
      console.error('Claim error:', error);
    }
  };

  const { totalClaimed, totalClaimable, totalRewards } = useMemo(() => {
    const totalClaimed = stakes.reduce((sum, stake) => sum + stake.rewardClaimed, 0);
    const totalClaimable = stakes.reduce((sum, stake) => sum + stake.claimable, 0);
    const totalRewards = totalClaimed + totalClaimable;
    return { totalClaimed, totalClaimable, totalRewards };
  }, [stakes]);

  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, boxShadow: 3 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: 'primary.main', fontWeight: 'bold', mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
      >
        Performance Overview
      </Typography>

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
                <TrendingUpIcon sx={{ color: 'info.main', mr: 1, fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                  Total Claimed
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main', fontSize: '1.25rem' }}>
                {formatCurrency(totalClaimed)}
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
                <AccessTimeIcon sx={{ color: 'warning.main', mr: 1, fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                  Total Claimable
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main', fontSize: '1.25rem' }}>
                {formatCurrency(totalClaimable)}
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
                <StarsIcon sx={{ color: 'error.main', mr: 1, fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>
                  Total Rewards
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main', fontSize: '1.25rem' }}>
                {formatCurrency(totalRewards)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                USDC
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
                      <TableCell>{stake.packageName || 'Unknown'}</TableCell>
                      <TableCell>{formatCurrency(stake.packagePrice)}</TableCell>
                      <TableCell>{stake.roiPercent}%</TableCell>
                      <TableCell>{formatDate(stake.lastClaimTime)}</TableCell>
                      <TableCell>{formatCurrency(stake.rewardClaimed)}</TableCell>
                      <TableCell>{formatCurrency(stake.claimable)}</TableCell>
                      <TableCell>
                        <Tooltip
                          title={
                            stake.claimable <= 0
                              ? 'No rewards available to claim'
                              : loadingStakes[stake.index]
                              ? 'Processing claim...'
                              : 'Claim available rewards'
                          }
                        >
                          <span>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleClaimClick(stake.index)}
                              disabled={loadingStakes[stake.index] || stake.claimable <= 0}
                              startIcon={loadingStakes[stake.index] ? <CircularProgress size={16} /> : null}
                            >
                              {loadingStakes[stake.index] ? 'Claiming...' : 'Claim'}
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
        </>
      )}
    </Card>
  );
};

export default PerformanceOverview;
