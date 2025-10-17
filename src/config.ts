// MLM Contract addresses - BSC Testnet
export const REFERRAL_CONTRACT_ADDRESS = '0xAeFa34F289085fCcB37dCd7B4d408189C581DCE1';

// USD Stack Contract - BSC Testnet
export const USD_STACK_CONTRACT_ADDRESS = '0x1cB6984E1A61416AEaf8Aa1787cbE116Ea10b11b';

// Owner address for MLM registration (default referrer)
export const OWNER_ADDRESS = '0xAeFa34F289085fCcB37dCd7B4d408189C581DCE1';
export const DEFAULT_REFERRAL_ADDRESS = OWNER_ADDRESS;

// Chain ID for BSC Testnet
export const CHAIN_ID = 97;

// Network configuration for BSC Testnet
export const NETWORK_CONFIG = {
  name: 'BSC Testnet',
  chainId: CHAIN_ID,
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  explorerUrl: 'https://testnet.bscscan.com',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
};
