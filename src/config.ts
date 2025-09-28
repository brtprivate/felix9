// MLM Contract addresses - BSC Mainnet
export const REFERRAL_CONTRACT_ADDRESS = '0xAeFa34F289085fCcB37dCd7B4d408189C581DCE1';

// USD Stack Contract - BSC Mainnet
export const USD_STACK_CONTRACT_ADDRESS = '0x1cB6984E1A61416AEaf8Aa1787cbE116Ea10b11b';

// Owner address for MLM registration (default referrer)
export const OWNER_ADDRESS = '0xAeFa34F289085fCcB37dCd7B4d408189C581DCE1';
export const DEFAULT_REFERRAL_ADDRESS = OWNER_ADDRESS;

// Chain ID for BSC Mainnet
export const CHAIN_ID = 56;

// Network configuration
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
