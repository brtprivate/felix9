// MLM Contract addresses - BSC Mainnet
export const REFERRAL_CONTRACT_ADDRESS = '0x1a15a92fB296773e1B4A9461e0872FC8EAC84Cd8';

// USD Stack Contract - BSC Mainnet
export const USD_STACK_CONTRACT_ADDRESS = '0x4Bc017402C8d5f336D0C770152C7e58c805800C8';

// Owner address for MLM registration (default referrer)
export const OWNER_ADDRESS = '0x1a15a92fB296773e1B4A9461e0872FC8EAC84Cd8';
export const DEFAULT_REFERRAL_ADDRESS = OWNER_ADDRESS;

// Chain ID for BSC Mainnet
export const CHAIN_ID = 56;

// Network configuration for BSC Mainnet
export const NETWORK_CONFIG = {
  name: 'BSC Mainnet',
  chainId: CHAIN_ID,
  rpcUrl: 'https://bsc-dataseed.binance.org/',
  explorerUrl: 'https://bscscan.com',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
};
