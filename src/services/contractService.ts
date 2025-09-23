import { readContract, writeContract, estimateGas, waitForTransactionReceipt } from "@wagmi/core";
import { config } from "../config/web3modal";
import { bscTestnet } from "wagmi/chains";
import type { Address } from "viem";
import { parseUnits, formatUnits, decodeErrorResult } from "viem";
import { USDC_CONTRACT_ADDRESS, USDC_ABI, usdcContractInteractions } from './approvalservice';

// Export USDC_ABI for use in other files
export { USDC_ABI };

// Contract configuration - BSC Testnet
export const DWC_CONTRACT_ADDRESS = "0xf0167ffe0480dca027c2328f8102d0cb649110ca" as Address;
export const TESTNET_CHAIN_ID = 97;

// DWC Contract ABI
export const DWC_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "initialOwner", "type": "address" },
      { "internalType": "address", "name": "_token", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "package", "type": "uint256" }
    ],
    "name": "LevelPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "Registration",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "MAX_ROI",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyDiamondPack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyElitePack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyGalaxyPack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyGoldPack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyInfinityPack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyLegendPack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyMegaPack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyPlatinumPack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyPremiumPack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyProPack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyRoyalPack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buySilverPack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyStaterPack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyTitanPack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_user", "type": "address" },
      { "internalType": "uint256", "name": "_index", "type": "uint256" }
    ],
    "name": "calculateClaimAble",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_directIncome", "type": "uint256" }
    ],
    "name": "changeDirectIncome",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "contractPercent",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "directIncome",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_amount", "type": "uint256" }
    ],
    "name": "liquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "packagePrice",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "percentDivider",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "ref", "type": "address" }
    ],
    "name": "registration",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "roiPercent",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "stakeRecord",
    "outputs": [
      { "internalType": "uint256", "name": "packageIndex", "type": "uint256" },
      { "internalType": "uint256", "name": "lasClaimTime", "type": "uint256" },
      { "internalType": "uint256", "name": "rewardClaimed", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "uniqueUsers",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "index", "type": "uint256" },
      { "internalType": "uint256", "name": "newPercent", "type": "uint256" }
    ],
    "name": "updateRoiPercent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "userRecord",
    "outputs": [
      { "internalType": "uint256", "name": "totalInvestment", "type": "uint256" },
      { "internalType": "address", "name": "referrer", "type": "address" },
      { "internalType": "uint256", "name": "referrerBonus", "type": "uint256" },
      { "internalType": "bool", "name": "isRegistered", "type": "bool" },
      { "internalType": "uint256", "name": "stakeCount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_index", "type": "uint256" }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  { "stateMutability": "payable", "type": "receive" }
];

// Interfaces for complex return types
interface UserRecord {
  totalInvestment: bigint;
  referrer: Address;
  referrerBonus: bigint;
  isRegistered: boolean;
  stakeCount: bigint;
}

interface StakeRecord {
  packageIndex: bigint;
  lasClaimTime: bigint;
  rewardClaimed: bigint;
}

// Interface for contract interactions
interface DWCContractInteractions {
  approveUSDC: (amount: bigint, account: Address) => Promise<`0x${string}`>;
  registration: (referrer: Address, account: Address) => Promise<`0x${string}`>;
  buyStaterPack: (account: Address) => Promise<`0x${string}`>;
  buySilverPack: (account: Address) => Promise<`0x${string}`>;
  buyGoldPack: (account: Address) => Promise<`0x${string}`>;
  buyPlatinumPack: (account: Address) => Promise<`0x${string}`>;
  buyDiamondPack: (account: Address) => Promise<`0x${string}`>;
  buyElitePack: (account: Address) => Promise<`0x${string}`>;
  buyProPack: (account: Address) => Promise<`0x${string}`>;
  buyPremiumPack: (account: Address) => Promise<`0x${string}`>;
  buyMegaPack: (account: Address) => Promise<`0x${string}`>;
  buyRoyalPack: (account: Address) => Promise<`0x${string}`>;
  buyLegendPack: (account: Address) => Promise<`0x${string}`>;
  buyGalaxyPack: (account: Address) => Promise<`0x${string}`>;
  buyTitanPack: (account: Address) => Promise<`0x${string}`>;
  buyInfinityPack: (account: Address) => Promise<`0x${string}`>;
  withdraw: (index: bigint, account: Address) => Promise<`0x${string}`>;
  liquidity: (amount: bigint, account: Address) => Promise<`0x${string}`>;
  changeDirectIncome: (directIncome: bigint, account: Address) => Promise<`0x${string}`>;
  transferOwnership: (newOwner: Address, account: Address) => Promise<`0x${string}`>;
  renounceOwnership: (account: Address) => Promise<`0x${string}`>;
  updateRoiPercent: (index: bigint, newPercent: bigint, account: Address) => Promise<`0x${string}`>;
  getUSDCBalance: (account: Address) => Promise<bigint>;
  getUserRecord: (user: Address) => Promise<UserRecord>;
  getStakeRecord: (user: Address, index: bigint) => Promise<StakeRecord>;
  getPackagePrice: (index: bigint) => Promise<bigint>;
  getRoiPercent: (index: bigint) => Promise<bigint>;
  getMaxRoi: () => Promise<bigint>;
  getContractPercent: () => Promise<bigint>;
  getDirectIncome: () => Promise<bigint>;
  getPercentDivider: () => Promise<bigint>;
  getOwner: () => Promise<Address>;
  getUniqueUsers: (index: bigint) => Promise<Address>;
  calculateClaimAble: (user: Address, index: bigint) => Promise<bigint>;
}

// Helper function for package purchase
async function buyPackage(
  functionName: string,
  packageIndex: bigint,
  account: Address,
  context: DWCContractInteractions
): Promise<`0x${string}`> {
  try {
    console.log(`Purchasing ${functionName} for ${account}`);
    const userRecord = await context.getUserRecord(account);
    if (!userRecord.isRegistered) {
      throw new Error("User is not registered");
    }
    const packagePrice = await context.getPackagePrice(packageIndex);
    const balance = await context.getUSDCBalance(account);
    if (balance < packagePrice) {
      throw new Error(`Insufficient USDC balance. Available: ${formatUnits(balance, 6)} USDC, Required: ${formatUnits(packagePrice, 6)} USDC`);
    }
    const allowance = await readContract(config, {
      abi: USDC_ABI,
      address: USDC_CONTRACT_ADDRESS,
      functionName: "allowance",
      args: [account, DWC_CONTRACT_ADDRESS],
      chainId: TESTNET_CHAIN_ID,
    }) as bigint;
    if (allowance < packagePrice) {
      console.log(`Approving ${formatUnits(packagePrice, 6)} USDC for DWC contract`);
      const approvalTx = await context.approveUSDC(packagePrice, account);
      await waitForTransactionReceipt(config, { hash: approvalTx, chainId: TESTNET_CHAIN_ID });
    }
    const gasEstimate = await estimateGas(config, {
      abi: DWC_ABI,
      address: DWC_CONTRACT_ADDRESS,
      functionName,
      args: [],
      chain: bscTestnet,
      account,
    });
    const txHash = await writeContract(config, {
      abi: DWC_ABI,
      address: DWC_CONTRACT_ADDRESS,
      functionName,
      args: [],
      chain: bscTestnet,
      account,
      gas: gasEstimate,
    });
    await waitForTransactionReceipt(config, { hash: txHash as `0x${string}`, chainId: TESTNET_CHAIN_ID });
    return txHash as `0x${string}`;
  } catch (error: any) {
    console.error(`Error purchasing ${functionName}: ${error.message || error}`);
    if (error.cause?.data) {
      const decodedError = decodeErrorResult({
        abi: DWC_ABI,
        data: error.cause.data,
      });
      throw new Error(`Purchase failed: ${decodedError.errorName || "Unknown error"} - ${decodedError.args?.join(", ") || ""}`);
    }
    throw new Error(`Failed to purchase package: ${error.message || "Unknown error"}`);
  }
}

// Contract interaction functions
export const dwcContractInteractions: DWCContractInteractions = {
  async approveUSDC(amount: bigint, account: Address): Promise<`0x${string}`> {
    try {
      console.log(`Approving ${formatUnits(amount, 6)} USDC for ${DWC_CONTRACT_ADDRESS}`);
      const gasEstimate = await estimateGas(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "approve",
        args: [DWC_CONTRACT_ADDRESS, amount],
        chain: bscTestnet,
        account,
      });
      const txHash = await writeContract(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "approve",
        args: [DWC_CONTRACT_ADDRESS, amount],
        chain: bscTestnet,
        account,
        gas: gasEstimate,
      });
      await waitForTransactionReceipt(config, { hash: txHash as `0x${string}`, chainId: TESTNET_CHAIN_ID });
      return txHash as `0x${string}`;
    } catch (error: any) {
      console.error(`Error approving USDC: ${error.message || error}`);
      throw new Error(`Failed to approve USDC: ${error.message || "Unknown error"}`);
    }
  },

  async registration(referrer: Address, account: Address): Promise<`0x${string}`> {
    try {
      console.log(`Registering user ${account} with referrer ${referrer}`);
      if (referrer === "0x0000000000000000000000000000000000000000") {
        throw new Error("Invalid referrer address: zero address is not allowed");
      }
      const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
      if (!ethAddressRegex.test(referrer)) {
        throw new Error("Invalid referrer address format");
      }
      const userRecord = await this.getUserRecord(account);
      if (userRecord.isRegistered) {
        throw new Error("User already registered");
      }
      const referrerRecord = await this.getUserRecord(referrer);
      if (!referrerRecord.isRegistered) {
        throw new Error("Referrer does not exist");
      }
      const gasEstimate = await estimateGas(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "registration",
        args: [referrer],
        chain: bscTestnet,
        account,
      });
      const txHash = await writeContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "registration",
        args: [referrer],
        chain: bscTestnet,
        account,
        gas: gasEstimate,
      });
      await waitForTransactionReceipt(config, { hash: txHash as `0x${string}`, chainId: TESTNET_CHAIN_ID });
      return txHash as `0x${string}`;
    } catch (error: any) {
      console.error(`Error registering user: ${error.message || error}`);
      throw error;
    }
  },

  async buyStaterPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyStaterPack", 0n, account, this);
  },

  async buySilverPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buySilverPack", 1n, account, this);
  },

  async buyGoldPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyGoldPack", 2n, account, this);
  },

  async buyPlatinumPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyPlatinumPack", 3n, account, this);
  },

  async buyDiamondPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyDiamondPack", 4n, account, this);
  },

  async buyElitePack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyElitePack", 5n, account, this);
  },

  async buyProPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyProPack", 6n, account, this);
  },

  async buyPremiumPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyPremiumPack", 7n, account, this);
  },

  async buyMegaPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyMegaPack", 8n, account, this);
  },

  async buyRoyalPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyRoyalPack", 9n, account, this);
  },

  async buyLegendPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyLegendPack", 10n, account, this);
  },

  async buyGalaxyPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyGalaxyPack", 11n, account, this);
  },

  async buyTitanPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyTitanPack", 12n, account, this);
  },

  async buyInfinityPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyInfinityPack", 13n, account, this);
  },

  async withdraw(index: bigint, account: Address): Promise<`0x${string}`> {
    try {
      console.log(`Withdrawing for index ${index} for ${account}`);
      const userRecord = await this.getUserRecord(account);
      if (!userRecord.isRegistered) {
        throw new Error("User is not registered");
      }
      const stake = await this.getStakeRecord(account, index);
      if (stake.packageIndex === 0n && stake.lasClaimTime === 0n) {
        throw new Error("Invalid stake index");
      }
      const claimable = await this.calculateClaimAble(account, index);
      if (claimable === 0n) {
        throw new Error("No claimable rewards");
      }
      const gasEstimate = await estimateGas(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "withdraw",
        args: [index],
        chain: bscTestnet,
        account,
      });
      const txHash = await writeContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "withdraw",
        args: [index],
        chain: bscTestnet,
        account,
        gas: gasEstimate,
      });
      await waitForTransactionReceipt(config, { hash: txHash as `0x${string}`, chainId: TESTNET_CHAIN_ID });
      return txHash as `0x${string}`;
    } catch (error: any) {
      console.error(`Error withdrawing: ${error.message || error}`);
      throw error;
    }
  },

  async liquidity(amount: bigint, account: Address): Promise<`0x${string}`> {
    try {
      console.log(`Adding liquidity ${formatUnits(amount, 6)} USDC for ${account}`);
      const owner = await this.getOwner();
      if (account !== owner) {
        throw new Error("Only owner can add liquidity");
      }
      const balance = await this.getUSDCBalance(account);
      if (balance < amount) {
        throw new Error(`Insufficient USDC balance. Available: ${formatUnits(balance, 6)} USDC, Required: ${formatUnits(amount, 6)} USDC`);
      }
      const allowance = await readContract(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "allowance",
        args: [account, DWC_CONTRACT_ADDRESS],
        chainId: TESTNET_CHAIN_ID,
      }) as bigint;
      if (allowance < amount) {
        console.log(`Approving ${formatUnits(amount, 6)} USDC for DWC contract`);
        const approvalTx = await this.approveUSDC(amount, account);
        await waitForTransactionReceipt(config, { hash: approvalTx, chainId: TESTNET_CHAIN_ID });
      }
      const gasEstimate = await estimateGas(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "liquidity",
        args: [amount],
        chain: bscTestnet,
        account,
      });
      const txHash = await writeContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "liquidity",
        args: [amount],
        chain: bscTestnet,
        account,
        gas: gasEstimate,
      });
      await waitForTransactionReceipt(config, { hash: txHash as `0x${string}`, chainId: TESTNET_CHAIN_ID });
      return txHash as `0x${string}`;
    } catch (error: any) {
      console.error(`Error adding liquidity: ${error.message || error}`);
      throw error;
    }
  },

  async changeDirectIncome(directIncome: bigint, account: Address): Promise<`0x${string}`> {
    try {
      console.log(`Changing direct income to ${directIncome} for ${account}`);
      const owner = await this.getOwner();
      if (account !== owner) {
        throw new Error("Only owner can change direct income");
      }
      const gasEstimate = await estimateGas(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "changeDirectIncome",
        args: [directIncome],
        chain: bscTestnet,
        account,
      });
      const txHash = await writeContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "changeDirectIncome",
        args: [directIncome],
        chain: bscTestnet,
        account,
        gas: gasEstimate,
      });
      await waitForTransactionReceipt(config, { hash: txHash as `0x${string}`, chainId: TESTNET_CHAIN_ID });
      return txHash as `0x${string}`;
    } catch (error: any) {
      console.error(`Error changing direct income: ${error.message || error}`);
      throw error;
    }
  },

  async transferOwnership(newOwner: Address, account: Address): Promise<`0x${string}`> {
    try {
      console.log(`Transferring ownership to ${newOwner} from ${account}`);
      const owner = await this.getOwner();
      if (account !== owner) {
        throw new Error("Only owner can transfer ownership");
      }
      if (newOwner === "0x0000000000000000000000000000000000000000") {
        throw new Error("Invalid new owner address");
      }
      const gasEstimate = await estimateGas(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "transferOwnership",
        args: [newOwner],
        chain: bscTestnet,
        account,
      });
      const txHash = await writeContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "transferOwnership",
        args: [newOwner],
        chain: bscTestnet,
        account,
        gas: gasEstimate,
      });
      await waitForTransactionReceipt(config, { hash: txHash as `0x${string}`, chainId: TESTNET_CHAIN_ID });
      return txHash as `0x${string}`;
    } catch (error: any) {
      console.error(`Error transferring ownership: ${error.message || error}`);
      throw error;
    }
  },

  async renounceOwnership(account: Address): Promise<`0x${string}`> {
    try {
      console.log(`Renouncing ownership for ${account}`);
      const owner = await this.getOwner();
      if (account !== owner) {
        throw new Error("Only owner can renounce ownership");
      }
      const gasEstimate = await estimateGas(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "renounceOwnership",
        args: [],
        chain: bscTestnet,
        account,
      });
      const txHash = await writeContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "renounceOwnership",
        args: [],
        chain: bscTestnet,
        account,
        gas: gasEstimate,
      });
      await waitForTransactionReceipt(config, { hash: txHash as `0x${string}`, chainId: TESTNET_CHAIN_ID });
      return txHash as `0x${string}`;
    } catch (error: any) {
      console.error(`Error renouncing ownership: ${error.message || error}`);
      throw error;
    }
  },

  async updateRoiPercent(index: bigint, newPercent: bigint, account: Address): Promise<`0x${string}`> {
    try {
      console.log(`Updating ROI percent for index ${index} to ${newPercent} by ${account}`);
      const owner = await this.getOwner();
      if (account !== owner) {
        throw new Error("Only owner can update ROI percent");
      }
      const gasEstimate = await estimateGas(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "updateRoiPercent",
        args: [index, newPercent],
        chain: bscTestnet,
        account,
      });
      const txHash = await writeContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "updateRoiPercent",
        args: [index, newPercent],
        chain: bscTestnet,
        account,
        gas: gasEstimate,
      });
      await waitForTransactionReceipt(config, { hash: txHash as `0x${string}`, chainId: TESTNET_CHAIN_ID });
      return txHash as `0x${string}`;
    } catch (error: any) {
      console.error(`Error updating ROI percent: ${error.message || error}`);
      throw error;
    }
  },

  async getUSDCBalance(account: Address): Promise<bigint> {
    try {
      console.log(`Fetching USDC balance for account: ${account}`);
      const balance = await readContract(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "balanceOf",
        args: [account],
        chainId: TESTNET_CHAIN_ID,
      }) as bigint;
      console.log(`USDC balance for ${account}: ${formatUnits(balance, 6)} USDC`);
      return balance;
    } catch (error: any) {
      console.error(`Error fetching USDC balance for ${account}: ${error.message || error}`);
      throw new Error(`Failed to fetch USDC balance: ${error.message || "Unknown error"}`);
    }
  },

  async getUserRecord(user: Address): Promise<UserRecord> {
    try {
      const [totalInvestment, referrer, referrerBonus, isRegistered, stakeCount] = await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "userRecord",
        args: [user],
        chainId: TESTNET_CHAIN_ID,
      }) as [bigint, Address, bigint, boolean, bigint];
      console.log(`User record for ${user}:`, { totalInvestment, referrer, referrerBonus, isRegistered, stakeCount });
      return { totalInvestment, referrer, referrerBonus, isRegistered, stakeCount };
    } catch (error: any) {
      console.error(`Error fetching user record: ${error.message || error}`);
      throw error;
    }
  },

  async getStakeRecord(user: Address, index: bigint): Promise<StakeRecord> {
    try {
      const [packageIndex, lasClaimTime, rewardClaimed] = await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "stakeRecord",
        args: [user, index],
        chainId: TESTNET_CHAIN_ID,
      }) as [bigint, bigint, bigint];
      console.log(`Stake record for ${user} at index ${index}:`, { packageIndex, lasClaimTime, rewardClaimed });
      return { packageIndex, lasClaimTime, rewardClaimed };
    } catch (error: any) {
      console.error(`Error fetching stake record: ${error.message || error}`);
      throw error;
    }
  },

  async getPackagePrice(index: bigint): Promise<bigint> {
    try {
      const price = await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "packagePrice",
        args: [index],
        chainId: TESTNET_CHAIN_ID,
      }) as bigint;
      console.log(`Package price for index ${index}: ${formatUnits(price, 6)} USDC`);
      return price;
    } catch (error: any) {
      console.error(`Error fetching package price: ${error.message || error}`);
      throw error;
    }
  },

  async getRoiPercent(index: bigint): Promise<bigint> {
    try {
      const percent = await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "roiPercent",
        args: [index],
        chainId: TESTNET_CHAIN_ID,
      }) as bigint;
      console.log(`ROI percent for index ${index}: ${percent}`);
      return percent;
    } catch (error: any) {
      console.error(`Error fetching ROI percent: ${error.message || error}`);
      throw error;
    }
  },

  async getMaxRoi(): Promise<bigint> {
    try {
      const maxRoi = await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "MAX_ROI",
        chainId: TESTNET_CHAIN_ID,
      }) as bigint;
      console.log(`Max ROI: ${maxRoi}`);
      return maxRoi;
    } catch (error: any) {
      console.error(`Error fetching max ROI: ${error.message || error}`);
      throw error;
    }
  },

  async getContractPercent(): Promise<bigint> {
    try {
      const percent = await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "contractPercent",
        chainId: TESTNET_CHAIN_ID,
      }) as bigint;
      console.log(`Contract percent: ${percent}`);
      return percent;
    } catch (error: any) {
      console.error(`Error fetching contract percent: ${error.message || error}`);
      throw error;
    }
  },

  async getDirectIncome(): Promise<bigint> {
    try {
      const income = await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "directIncome",
        chainId: TESTNET_CHAIN_ID,
      }) as bigint;
      console.log(`Direct income: ${income}`);
      return income;
    } catch (error: any) {
      console.error(`Error fetching direct income: ${error.message || error}`);
      throw error;
    }
  },

  async getPercentDivider(): Promise<bigint> {
    try {
      const divider = await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "percentDivider",
        chainId: TESTNET_CHAIN_ID,
      }) as bigint;
      console.log(`Percent divider: ${divider}`);
      return divider;
    } catch (error: any) {
      console.error(`Error fetching percent divider: ${error.message || error}`);
      throw error;
    }
  },

  async getOwner(): Promise<Address> {
    try {
      const owner = await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "owner",
        chainId: TESTNET_CHAIN_ID,
      }) as Address;
      console.log(`Owner: ${owner}`);
      return owner;
    } catch (error: any) {
      console.error(`Error fetching owner: ${error.message || error}`);
      throw error;
    }
  },

  async getUniqueUsers(index: bigint): Promise<Address> {
    try {
      const user = await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "uniqueUsers",
        args: [index],
        chainId: TESTNET_CHAIN_ID,
      }) as Address;
      console.log(`Unique user at index ${index}: ${user}`);
      return user;
    } catch (error: any) {
      console.error(`Error fetching unique user: ${error.message || error}`);
      throw error;
    }
  },

  async calculateClaimAble(user: Address, index: bigint): Promise<bigint> {
    try {
      const claimable = await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "calculateClaimAble",
        args: [user, index],
        chainId: TESTNET_CHAIN_ID,
      }) as bigint;
      console.log(`Claimable amount for ${user} at index ${index}: ${formatUnits(claimable, 6)} USDC`);
      return claimable;
    } catch (error: any) {
      console.error(`Error calculating claimable amount: ${error.message || error}`);
      throw error;
    }
  },
};

// Export individual functions for convenience
export const { approveUSDC } = usdcContractInteractions;

export const {
  registration,
  buyStaterPack,
  buySilverPack,
  buyGoldPack,
  buyPlatinumPack,
  buyDiamondPack,
  buyElitePack,
  buyProPack,
  buyPremiumPack,
  buyMegaPack,
  buyRoyalPack,
  buyLegendPack,
  buyGalaxyPack,
  buyTitanPack,
  buyInfinityPack,
  withdraw,
  liquidity,
  changeDirectIncome,
  transferOwnership,
  renounceOwnership,
  updateRoiPercent,
  getUSDCBalance,
  getUserRecord,
  getStakeRecord,
  getPackagePrice,
  getRoiPercent,
  getMaxRoi,
  getContractPercent,
  getDirectIncome,
  getPercentDivider,
  getOwner,
  getUniqueUsers,
  calculateClaimAble,
} = dwcContractInteractions;