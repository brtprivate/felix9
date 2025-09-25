import React from 'react';
import { Box, Button, Card, TextField, Typography } from '@mui/material';

const ReferralSection = ({ wallet, setSuccess }) => {
  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, boxShadow: 3, display: 'flex', flexDirection: 'column' }}>
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
    </Card>
  );
};

export default ReferralSection;