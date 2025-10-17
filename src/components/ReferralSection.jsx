import React from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Divider } from '@mui/material';

const ReferralSection = ({ wallet, setSuccess }) => {
  return (
    <Card sx={{ 
      boxShadow: 3, 
      borderRadius: 2,
      backgroundColor: '#2a2a2a',
      border: '1px solid #3a3a3a'
    }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{ 
            fontSize: { xs: '1rem', sm: '1.25rem' }, 
            fontWeight: 600,
            color: '#ffffff'
          }}
        >
          Your Referral Code
        </Typography>

        {/* Code Field */}
        <TextField
          fullWidth
          label="Referral Code"
          value={wallet.account || ''}
          InputProps={{ readOnly: true }}
          size="small"
          sx={{
            '& .MuiInputBase-input': { 
              fontSize: { xs: '0.875rem', sm: '1rem' },
              color: '#ffffff'
            },
            '& .MuiInputLabel-root': {
              color: '#ffffff',
            },
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
          }}
        />

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              if (wallet.account) {
                navigator.clipboard.writeText(wallet.account);
                setSuccess('Referral code copied to clipboard!');
              }
            }}
            disabled={!wallet.account}
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              color: '#ffffff',
              borderColor: '#ffffff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: '#ffffff'
              }
            }}
          >
            Copy
          </Button>
          <Button
            variant="outlined"
            fullWidth
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
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              color: '#ffffff',
              borderColor: '#ffffff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: '#ffffff'
              }
            }}
          >
            Share
          </Button>
        </Box>

        <Divider sx={{ borderColor: '#3a3a3a' }} />

        {/* Info Text */}
        <Typography
          variant="body2"
          sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
            lineHeight: 1.6,
            color: '#b0b0b0'
          }}
        >
          Share this code with your friends. You'll earn referral bonuses when they join
          and purchase a package!
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReferralSection;
