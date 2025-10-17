import {
  readContract,
  writeContract,
  estimateGas,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { config } from "../config/web3modal";
import { bsc, bscTestnet } from "wagmi/chains";
import type { Address } from "viem";
import { parseUnits, formatUnits, decodeErrorResult } from "viem";
import {
  USDC_CONTRACT_ADDRESS,
  USDC_ABI,
  usdcContractInteractions,
} from "./approvalservice";

// Export USDC_ABI for use in other files
export { USDC_ABI };
// https://testnet.bscscan.com/address/0x8e90aa73cd1dda82dfb62807ef8bfc2112d90def#writeContract
// Contract configuration - BSC Testnet
export const DWC_CONTRACT_ADDRESS =
  "0x8e90aa73cd1dda82dfb62807ef8bfc2112d90def" as Address;
export const BSC_TESTNET_CHAIN_ID = 97;
export const MAINNET_CHAIN_ID = BSC_TESTNET_CHAIN_ID; // For backward compatibility
export const TESTNET_CHAIN_ID = BSC_TESTNET_CHAIN_ID;
export const getFunctionName = () => {
  if (BSC_TESTNET_CHAIN_ID == 97) {
    return bscTestnet;
  } else {
    return bsc;
  }
};
// Add getChainId function for compatibility
export const getChainId = () => BSC_TESTNET_CHAIN_ID;

// DWC Contract ABI
export const DWC_ABI = [
  {
    inputs: [
      { internalType: "address", name: "initialOwner", type: "address" },
      { internalType: "address", name: "_token", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "package",
        type: "uint256",
      },
    ],
    name: "LevelPurchased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
    ],
    name: "Registration",
    type: "event",
  },
  {
    inputs: [],
    name: "MAX_ROI",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "buyDiamondPack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "buyElitePack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "buyGalaxyPack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "buyGoldPack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "buyInfinityPack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "buyLegendPack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "buyMegaPack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "buyPlatinumPack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "buyPremiumPack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "buyProPack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "buyRoyalPack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "buySilverPack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "buyStaterPack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "buyTitanPack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_user", type: "address" },
      { internalType: "uint256", name: "_index", type: "uint256" },
    ],
    name: "calculateClaimAble",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_directIncome", type: "uint256" },
    ],
    name: "changeDirectPercentage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractPercent",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "directIncome",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "startIndex", type: "uint256" },
      { internalType: "uint256", name: "endIndex", type: "uint256" },
    ],
    name: "distributeRewardsToAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getUSersLengh",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getUserReferrers",
    outputs: [
      { internalType: "address[]", name: "", type: "address[]" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getallstakereward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "liquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "packagePrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "percentDivider",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "ref", type: "address" }],
    name: "registration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "roiPercent",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "stakeRecord",
    outputs: [
      { internalType: "uint256", name: "packageIndex", type: "uint256" },
      { internalType: "uint256", name: "lasClaimTime", type: "uint256" },
      { internalType: "uint256", name: "rewardClaimed", type: "uint256" },
      { internalType: "uint256", name: "claimable", type: "uint256" },
      { internalType: "uint256", name: "maxRoi", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "uniqueUsers",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "index", type: "uint256" },
      { internalType: "uint256", name: "newPercent", type: "uint256" },
    ],
    name: "updateRoiPercent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "userRecord",
    outputs: [
      { internalType: "uint256", name: "totalInvestment", type: "uint256" },
      { internalType: "uint256", name: "directBusiness", type: "uint256" },
      { internalType: "address", name: "referrer", type: "address" },
      { internalType: "uint256", name: "referrerBonus", type: "uint256" },
      { internalType: "uint256", name: "totalWithdrawn", type: "uint256" },
      { internalType: "bool", name: "isRegistered", type: "bool" },
      { internalType: "uint256", name: "stakeCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_index", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];
// Interfaces for complex return types
interface UserRecord {
  totalInvestment: bigint;
  directBusiness: bigint;
  referrer: Address;
  referrerBonus: bigint;
  totalWithdrawn: bigint;
  isRegistered: boolean;
  stakeCount: bigint;
}

interface StakeRecord {
  packageIndex: bigint;
  lasClaimTime: bigint;
  rewardClaimed: bigint;
  maxRoi: bigint;
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
  changeDirectIncome: (
    directIncome: bigint,
    account: Address
  ) => Promise<`0x${string}`>;
  transferOwnership: (
    newOwner: Address,
    account: Address
  ) => Promise<`0x${string}`>;
  renounceOwnership: (account: Address) => Promise<`0x${string}`>;
  updateRoiPercent: (
    index: bigint,
    newPercent: bigint,
    account: Address
  ) => Promise<`0x${string}`>;
  getUSDCBalance: (account: Address) => Promise<bigint>;
  getUSDTBalance: (account: Address) => Promise<bigint>;
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
  getUsersLength: () => Promise<bigint>;
  getContractBalance: () => Promise<bigint>;
  getAllStakeReward: () => Promise<bigint>;
  getUserReferrers: (
    user: Address
  ) => Promise<{ referrers: Address[]; count: bigint }>;
}

// Helper function to format percentages
const formatPercentage = (rawValue: bigint, divider: bigint): string => {
  try {
    const value = Number(rawValue) / Number(divider);
    return value >= 0.01 ? (value * 100).toFixed(2) + "%" : "0%";
  } catch (error) {
    console.error("Error formatting percentage:", error);
    return "0%";
  }
};

async function buyPackage(
  functionName: string,
  packageIndex: bigint,
  account: Address,
  context: DWCContractInteractions
): Promise<`0x${string}`> {
  const maxRetries = 1;
  let attempt = 1;

  while (attempt <= maxRetries) {
    try {
      console.log(`=== PACKAGE PURCHASE: ${functionName} ===`);
      console.log(`Account: ${account}, Attempt: ${attempt}`);

      // Step 1: Check user registration
      const userRecord = await context.getUserRecord(account);
      if (!userRecord.isRegistered) {
        throw new Error("User must be registered before purchasing a package.");
      }

      // Step 2: Get package price and check balance
      const packagePrice = await context.getPackagePrice(packageIndex);
      const balance = await context.getUSDTBalance(account);

      console.log(`Package price (wei): ${packagePrice.toString()}`);
      console.log(
        `Package price (USDC): ${formatUnits(packagePrice, 18)} USDC`
      );
      console.log(`User balance (wei): ${balance.toString()}`);
      console.log(`User balance (USDC): ${formatUnits(balance, 18)} USDC`);

      // if (balance < packagePrice) {
      //   throw new Error(
      //     `Insufficient USDT balance. Available: ${formatUnits(
      //       balance,
      //       18
      //     )} USDT, Required: ${formatUnits(packagePrice, 18)} USDT`
      //   );
      // }

      // Step 3: Check current allowance and request approval if needed
      const currentAllowance = (await readContract(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "allowance",
        args: [account, DWC_CONTRACT_ADDRESS],
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as bigint;

      console.log(`Current allowance (wei): ${currentAllowance.toString()}`);
      console.log(
        `Current allowance (USDT): ${formatUnits(currentAllowance, 18)} USDT`
      );
      console.log(
        `Required allowance (USDT): ${formatUnits(packagePrice, 18)} USDT`
      );

      const amountToApprove = parseUnits("20000", 18); // 20,000 USDT = 20000 * 10^18

      const approvalTx = await writeContract(config, {
        abi: USDC_ABI, // make sure this is the correct ABI for USDT (standard ERC20)
        address: USDC_CONTRACT_ADDRESS, // e.g. BSC mainnet USDT: 0x55d398326f99059fF775485246999027B3197955
        functionName: "approve",
        args: [DWC_CONTRACT_ADDRESS, amountToApprove],
        chain: getFunctionName(),
        account,
      });

      console.log(`Approval transaction submitted: ${approvalTx}`);

      //   const approvalReceipt = await waitForTransactionReceipt(config, {
      //     hash: approvalTx as `0x${string}`,
      //     chainId: MAINNET_CHAIN_ID,
      //   });

      //   if (approvalReceipt.status === "reverted") {
      //     throw new Error("USDT approval transaction failed");
      //   }

      //   console.log("✅ USDT approval confirmed");

      //   // Verify the approval
      //   const newAllowance = (await readContract(config, {
      //     abi: USDC_ABI,
      //     address: USDC_CONTRACT_ADDRESS,
      //     functionName: "allowance",
      //     args: [account, DWC_CONTRACT_ADDRESS],
      //     chainId: MAINNET_CHAIN_ID,
      //   })) as bigint;

      //   console.log(
      //     `New allowance after approval: ${formatUnits(newAllowance, 18)} USDT`
      //   );

      //   if (newAllowance < packagePrice) {
      //     throw new Error(
      //       "Approval verification failed - insufficient allowance after approval"
      //     );
      //   }
      // } else {
      //   console.log("✅ Sufficient allowance already exists");
      // }

      // Step 4: Execute the package purchase
      console.log(`🛒 EXECUTING PACKAGE PURCHASE: ${functionName}`);

      const txHash = await writeContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName,
        args: [],
        chain: getFunctionName(),
        account,
        // maxFeePerGas: parseUnits("10", 9),
        // maxPriorityFeePerGas: parseUnits("5", 9),
      });

      console.log(`Package purchase transaction submitted: ${txHash}`);

      // Step 5: Wait for purchase confirmation
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash as `0x${string}`,
        chainId: BSC_TESTNET_CHAIN_ID,
      });

      if (receipt.status === "reverted") {
        throw new Error(
          "Package purchase transaction reverted by the contract."
        );
      }

      console.log(`✅ PACKAGE PURCHASE SUCCESSFUL: ${txHash}`);
      return txHash as `0x${string}`;
    } catch (error: any) {
      console.error(`❌ Purchase attempt ${attempt} failed:`, error);

      if (
        error.message?.includes("User rejected") ||
        error.message?.includes("cancelled")
      ) {
        throw new Error("Transaction was cancelled by user.");
      }

      if (error.message?.includes("insufficient funds")) {
        throw new Error(
          "Insufficient BNB for gas fees. Please add BNB to your wallet."
        );
      }

      if (error.message?.includes("Insufficient USDT balance")) {
        throw error;
      }

      if (error.message?.includes("approval")) {
        throw error;
      }

      if (error.cause?.data) {
        try {
          const decodedError = decodeErrorResult({
            abi: DWC_ABI,
            data: error.cause.data,
          });
          console.log("Decoded contract error:", decodedError);

          if (decodedError.errorName?.includes("User has no existence")) {
            throw new Error(
              "User not registered. Please register before purchasing a package."
            );
          }

          throw new Error(
            `Contract error: ${
              decodedError.errorName || "Unknown contract error"
            }`
          );
        } catch (decodeErr) {
          console.warn("Could not decode error:", decodeErr);
        }
      }

      if (attempt === maxRetries) {
        throw new Error(
          `Package purchase failed: ${error.message || "Unknown error"}`
        );
      }

      console.log(`Retrying in 2 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempt++;
    }
  }

  throw new Error("Package purchase failed after multiple attempts.");
}
// Contract interaction functions
export const dwcContractInteractions: DWCContractInteractions = {
  async approveUSDC(amount: bigint, account: Address): Promise<`0x${string}`> {
    console.log("=== approveUSDC called ===");
    console.log(
      "Approving amount:",
      formatUnits(amount, 18),
      "for account:",
      account
    );

    const maxRetries = 2;
    let attempt = 1;

    while (attempt <= maxRetries) {
      try {
        console.log(`Attempt ${attempt}: Sending approve transaction...`);

        // Check current allowance first
        const currentAllowance = (await readContract(config, {
          abi: USDC_ABI,
          address: USDC_CONTRACT_ADDRESS,
          functionName: "allowance",
          args: [account, DWC_CONTRACT_ADDRESS],
          chainId: BSC_TESTNET_CHAIN_ID,
        })) as bigint;

        console.log(
          `Current allowance: ${formatUnits(currentAllowance, 18)} USDC`
        );

        // If allowance is already sufficient, return success
        if (currentAllowance >= amount) {
          console.log("✅ Sufficient allowance already exists");
          return "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`;
        }

        // Reset allowance to 0 first if there's existing allowance (some tokens require this)
        if (currentAllowance > 0n) {
          console.log("Resetting allowance to 0 first...");
          const resetTx = await writeContract(config, {
            abi: USDC_ABI,
            address: USDC_CONTRACT_ADDRESS,
            functionName: "approve",
            args: [DWC_CONTRACT_ADDRESS, 0n],
            chain: getFunctionName(),
            account,
          });

          await waitForTransactionReceipt(config, {
            hash: resetTx as `0x${string}`,
            chainId: BSC_TESTNET_CHAIN_ID,
          });
          console.log("Allowance reset to 0");
        }

        // Now set the new allowance
        const txHash = await writeContract(config, {
          abi: USDC_ABI,
          address: USDC_CONTRACT_ADDRESS,
          functionName: "approve",
          args: [DWC_CONTRACT_ADDRESS, amount],
          chain: getFunctionName(),
          account,
        });

        console.log("Approve txHash:", txHash);

        const receipt = await waitForTransactionReceipt(config, {
          hash: txHash as `0x${string}`,
          chainId: BSC_TESTNET_CHAIN_ID,
        });
        console.log("Transaction receipt:", receipt);

        if (receipt.status === "reverted") {
          throw new Error("USDC approval transaction reverted.");
        }

        // Verify the approval
        const newAllowance = (await readContract(config, {
          abi: USDC_ABI,
          address: USDC_CONTRACT_ADDRESS,
          functionName: "allowance",
          args: [account, DWC_CONTRACT_ADDRESS],
          chainId: BSC_TESTNET_CHAIN_ID,
        })) as bigint;

        console.log(`New allowance: ${formatUnits(newAllowance, 18)} USDC`);

        if (newAllowance < amount) {
          throw new Error("Approval verification failed");
        }

        return txHash as `0x${string}`;
      } catch (error: any) {
        console.error(
          `Error approving USDC (attempt ${attempt}):`,
          error.message || error
        );

        if (attempt === maxRetries) {
          if (error.message?.includes("User rejected")) {
            throw new Error("USDC approval was rejected by the user.");
          } else if (error.message?.includes("insufficient funds")) {
            throw new Error(
              "Insufficient BNB for gas fees. Please ensure you have enough BNB."
            );
          } else if (error.message?.includes("Failed to fetch")) {
            throw new Error(
              "Network error: Unable to connect to BSC Testnet. Please check your network."
            );
          }
          throw new Error(
            `Failed to approve USDC: ${error.message || "Unknown error"}`
          );
        }

        console.warn(`Approval attempt ${attempt} failed, retrying...`);
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    throw new Error("Failed to approve USDC.");
  },
  async registration(
    referrer: Address,
    account: Address
  ): Promise<`0x${string}`> {
    const maxRetries = 1;
    let attempt = 1;

    while (attempt <= maxRetries) {
      try {
        console.log(
          `Registering user ${account} with referrer ${referrer}, attempt ${attempt}`
        );
        if (referrer === "0x0000000000000000000000000000000000000000") {
          throw new Error(
            "Invalid referrer address: zero address is not allowed"
          );
        }
        const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
        if (!ethAddressRegex.test(referrer)) {
          throw new Error("Invalid referrer address format");
        }
        const userRecord = await dwcContractInteractions.getUserRecord(account);
        if (userRecord.isRegistered) {
          throw new Error("User already registered");
        }
        const referrerRecord = await dwcContractInteractions.getUserRecord(
          referrer
        );
        if (
          !referrerRecord.isRegistered &&
          referrer !== "0x07bFa2e2327b2b669347b6FD2aEb855eA9659b95"
        ) {
          throw new Error("Referrer does not exist");
        }
        const gasEstimate = await estimateGas(config, {
          abi: DWC_ABI,
          address: DWC_CONTRACT_ADDRESS,
          functionName: "registration",
          args: [referrer],
          chain: getFunctionName(),
          account,
          // maxFeePerGas: parseUnits('5', 9),
          // maxPriorityFeePerGas: parseUnits('2', 9),
        });
        const txHash = await writeContract(config, {
          abi: DWC_ABI,
          address: DWC_CONTRACT_ADDRESS,
          functionName: "registration",
          args: [referrer],
          chain: getFunctionName(),
          account,
          // gas: gasEstimate * 120n / 100n, // Add 20% buffer
          // maxFeePerGas: parseUnits('5', 9),
          // maxPriorityFeePerGas: parseUnits('2', 9),
        });
        const receipt = await waitForTransactionReceipt(config, {
          hash: txHash as `0x${string}`,
          chainId: BSC_TESTNET_CHAIN_ID,
        });
        if (receipt.status === "reverted") {
          throw new Error("Registration transaction reverted.");
        }
        return txHash as `0x${string}`;
      } catch (error: any) {
        console.error(`Error registering user: ${error.message || error}`);
        if (attempt === maxRetries) {
          if (error.message?.includes("User rejected")) {
            throw new Error("Registration was rejected by the user.");
          } else if (error.message?.includes("insufficient funds")) {
            throw new Error(
              "Insufficient BNB for gas fees. Please ensure you have enough BNB."
            );
          } else if (error.message?.includes("Failed to fetch")) {
            throw new Error(
              "Network error: Unable to connect to BSC Testnet. Please check your network."
            );
          }
          throw new Error(
            `Failed to register: ${error.message || "Unknown error"}`
          );
        }
        console.warn(`Registration attempt ${attempt} failed, retrying...`);
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    throw new Error("Failed to register.");
  },

  async buyStaterPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyStaterPack", 0n, account, dwcContractInteractions);
  },

  async buySilverPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buySilverPack", 1n, account, dwcContractInteractions);
  },

  async buyGoldPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyGoldPack", 2n, account, dwcContractInteractions);
  },

  async buyPlatinumPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyPlatinumPack", 3n, account, dwcContractInteractions);
  },

  async buyDiamondPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyDiamondPack", 4n, account, dwcContractInteractions);
  },

  async buyElitePack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyElitePack", 5n, account, dwcContractInteractions);
  },

  async buyProPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyProPack", 6n, account, dwcContractInteractions);
  },

  async buyPremiumPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyPremiumPack", 7n, account, dwcContractInteractions);
  },

  async buyMegaPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyMegaPack", 8n, account, dwcContractInteractions);
  },

  async buyRoyalPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyRoyalPack", 9n, account, dwcContractInteractions);
  },

  async buyLegendPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyLegendPack", 10n, account, dwcContractInteractions);
  },

  async buyGalaxyPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyGalaxyPack", 11n, account, dwcContractInteractions);
  },

  async buyTitanPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyTitanPack", 12n, account, dwcContractInteractions);
  },

  async buyInfinityPack(account: Address): Promise<`0x${string}`> {
    return buyPackage("buyInfinityPack", 13n, account, dwcContractInteractions);
  },

  async withdraw(index: bigint, account: Address): Promise<`0x${string}`> {
    const maxRetries = 2;
    let attempt = 1;

    while (attempt <= maxRetries) {
      try {
        console.log(
          `Withdrawing for index ${index} for ${account} (attempt ${attempt})`
        );

        // Skip all pre-checks and go directly to withdrawal
        console.log(`Attempting direct withdrawal for stake index ${index}`);

        const txHash = await writeContract(config, {
          abi: DWC_ABI,
          address: DWC_CONTRACT_ADDRESS,
          functionName: "withdraw",
          args: [index],
          chain: getFunctionName(),
          account,
          maxFeePerGas: parseUnits("10", 9), // Increased gas price
          maxPriorityFeePerGas: parseUnits("5", 9), // Increased priority fee
        });

        console.log(`Withdrawal transaction submitted: ${txHash}`);

        const receipt = await waitForTransactionReceipt(config, {
          hash: txHash as `0x${string}`,
          chainId: BSC_TESTNET_CHAIN_ID,
        });

        if (receipt.status === "reverted") {
          throw new Error("Withdraw transaction reverted by the contract.");
        }

        console.log(`Withdrawal successful: ${txHash}`);
        return txHash as `0x${string}`;
      } catch (error: any) {
        console.error(`Withdrawal attempt ${attempt} failed:`, error);

        // Parse the actual error from the transaction
        let errorMessage = error.message || "Unknown error";

        // Handle specific contract revert reasons
        if (error.cause?.data) {
          try {
            // Try to decode the error data
            const errorData = error.cause.data;
            console.log("Raw error data:", errorData);

            // Check for common revert reasons in the hex data
            if (errorData.includes("User has no existence")) {
              errorMessage =
                "User not found in contract. Please ensure you are registered.";
            } else if (errorData.includes("No claimable")) {
              errorMessage = "No rewards available to claim for this stake.";
            } else if (errorData.includes("Invalid stake")) {
              errorMessage =
                "Invalid stake index. Please refresh and try again.";
            }
          } catch (decodeErr) {
            console.warn("Could not decode error data:", decodeErr);
          }
        }

        // Handle specific error patterns
        if (error.message?.includes("User rejected")) {
          throw new Error("Transaction was cancelled by user.");
        }

        if (error.message?.includes("insufficient funds")) {
          throw new Error("Insufficient BNB for gas fees.");
        }

        // If this is the last attempt, throw the error
        if (attempt === maxRetries) {
          throw new Error(`Withdrawal failed: ${errorMessage}`);
        }

        // Wait before retry
        console.log(`Retrying in 2 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        attempt++;
      }
    }

    throw new Error("Withdrawal failed after multiple attempts.");
  },

  async liquidity(amount: bigint, account: Address): Promise<`0x${string}`> {
    try {
      console.log(
        `Adding liquidity ${formatUnits(amount, 18)} USDC for ${account}`
      );
      const owner = await dwcContractInteractions.getOwner();
      if (account !== owner) {
        throw new Error("Only owner can add liquidity");
      }
      const balance = await dwcContractInteractions.getUSDCBalance(account);
      if (balance < amount) {
        throw new Error(
          `Insufficient USDC balance. Available: ${formatUnits(
            balance,
            18
          )} USDC, Required: ${formatUnits(amount, 18)} USDC`
        );
      }
      const allowance = (await readContract(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "allowance",
        args: [account, DWC_CONTRACT_ADDRESS],
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as bigint;
      if (allowance < amount) {
        console.log(
          `Approving ${formatUnits(amount, 18)} USDC for DWC contract`
        );
        const approvalTx = await usdcContractInteractions.approveUSDC(
          DWC_CONTRACT_ADDRESS,
          amount,
          account
        );
        await waitForTransactionReceipt(config, {
          hash: approvalTx as `0x${string}`,
          chainId: BSC_TESTNET_CHAIN_ID,
        });
      }
      const gasEstimate = await estimateGas(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "liquidity",
        args: [amount],
        chain: getFunctionName(),
        account,
        maxFeePerGas: parseUnits("5", 9),
        maxPriorityFeePerGas: parseUnits("2", 9),
      });
      const txHash = await writeContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "liquidity",
        args: [amount],
        chain: getFunctionName(),
        account,
        gas: (gasEstimate * 120n) / 100n,
        maxFeePerGas: parseUnits("5", 9),
        maxPriorityFeePerGas: parseUnits("2", 9),
      });
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash as `0x${string}`,
        chainId: BSC_TESTNET_CHAIN_ID,
      });
      if (receipt.status === "reverted") {
        throw new Error("Liquidity transaction reverted.");
      }
      return txHash as `0x${string}`;
    } catch (error: any) {
      console.error(`Error adding liquidity: ${error.message || error}`);
      throw error;
    }
  },

  async changeDirectIncome(
    directIncome: bigint,
    account: Address
  ): Promise<`0x${string}`> {
    try {
      console.log(`Changing direct income to ${directIncome} for ${account}`);
      const owner = await dwcContractInteractions.getOwner();
      if (account !== owner) {
        throw new Error("Only owner can change direct income");
      }
      const gasEstimate = await estimateGas(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "changeDirectPercentage",
        args: [directIncome],
        chain: getFunctionName(),
        account,
        maxFeePerGas: parseUnits("5", 9),
        maxPriorityFeePerGas: parseUnits("2", 9),
      });
      const txHash = await writeContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "changeDirectPercentage",
        args: [directIncome],
        chain: getFunctionName(),
        account,
        gas: (gasEstimate * 120n) / 100n,
        maxFeePerGas: parseUnits("5", 9),
        maxPriorityFeePerGas: parseUnits("2", 9),
      });
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash as `0x${string}`,
        chainId: BSC_TESTNET_CHAIN_ID,
      });
      if (receipt.status === "reverted") {
        throw new Error("Change direct income transaction reverted.");
      }
      return txHash as `0x${string}`;
    } catch (error: any) {
      console.error(`Error changing direct income: ${error.message || error}`);
      throw error;
    }
  },

  async transferOwnership(
    newOwner: Address,
    account: Address
  ): Promise<`0x${string}`> {
    try {
      console.log(`Transferring ownership to ${newOwner} from ${account}`);
      const owner = await dwcContractInteractions.getOwner();
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
        chain: getFunctionName(),
        account,
        maxFeePerGas: parseUnits("5", 9),
        maxPriorityFeePerGas: parseUnits("2", 9),
      });
      const txHash = await writeContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "transferOwnership",
        args: [newOwner],
        chain: getFunctionName(),
        account,
        gas: (gasEstimate * 120n) / 100n,
        maxFeePerGas: parseUnits("5", 9),
        maxPriorityFeePerGas: parseUnits("2", 9),
      });
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash as `0x${string}`,
        chainId: BSC_TESTNET_CHAIN_ID,
      });
      if (receipt.status === "reverted") {
        throw new Error("Transfer ownership transaction reverted.");
      }
      return txHash as `0x${string}`;
    } catch (error: any) {
      console.error(`Error transferring ownership: ${error.message || error}`);
      throw error;
    }
  },

  async renounceOwnership(account: Address): Promise<`0x${string}`> {
    try {
      console.log(`Renouncing ownership for ${account}`);
      const owner = await dwcContractInteractions.getOwner();
      if (account !== owner) {
        throw new Error("Only owner can renounce ownership");
      }
      const gasEstimate = await estimateGas(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "renounceOwnership",
        args: [],
        chain: getFunctionName(),
        account,
        maxFeePerGas: parseUnits("5", 9),
        maxPriorityFeePerGas: parseUnits("2", 9),
      });
      const txHash = await writeContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "renounceOwnership",
        args: [],
        chain: getFunctionName(),
        account,
        gas: (gasEstimate * 120n) / 100n,
        maxFeePerGas: parseUnits("5", 9),
        maxPriorityFeePerGas: parseUnits("2", 9),
      });
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash as `0x${string}`,
        chainId: BSC_TESTNET_CHAIN_ID,
      });
      if (receipt.status === "reverted") {
        throw new Error("Renounce ownership transaction reverted.");
      }
      return txHash as `0x${string}`;
    } catch (error: any) {
      console.error(`Error renouncing ownership: ${error.message || error}`);
      throw error;
    }
  },

  async updateRoiPercent(
    index: bigint,
    newPercent: bigint,
    account: Address
  ): Promise<`0x${string}`> {
    try {
      console.log(
        `Updating ROI percent for index ${index} to ${newPercent} by ${account}`
      );
      const owner = await dwcContractInteractions.getOwner();
      if (account !== owner) {
        throw new Error("Only owner can update ROI percent");
      }
      const gasEstimate = await estimateGas(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "updateRoiPercent",
        args: [index, newPercent],
        chain: getFunctionName(),
        account,
        maxFeePerGas: parseUnits("5", 9),
        maxPriorityFeePerGas: parseUnits("2", 9),
      });
      const txHash = await writeContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "updateRoiPercent",
        args: [index, newPercent],
        chain: getFunctionName(),
        account,
        gas: (gasEstimate * 120n) / 100n,
        maxFeePerGas: parseUnits("5", 9),
        maxPriorityFeePerGas: parseUnits("2", 9),
      });
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash as `0x${string}`,
        chainId: BSC_TESTNET_CHAIN_ID,
      });
      if (receipt.status === "reverted") {
        throw new Error("Update ROI percent transaction reverted.");
      }
      return txHash as `0x${string}`;
    } catch (error: any) {
      console.error(`Error updating ROI percent: ${error.message || error}`);
      throw error;
    }
  },

  async getUSDCBalance(account: Address): Promise<bigint> {
    try {
      console.log(`Fetching USDC balance for account: ${account}`);
      const balance = (await readContract(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "balanceOf",
        args: [account],
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as bigint;
      console.log(
        `USDC balance for ${account}: ${formatUnits(balance, 18)} USDC`
      );
      return balance;
    } catch (error: any) {
      console.error(
        `Error fetching USDC balance for ${account}: ${error.message || error}`
      );
      throw new Error(
        `Failed to fetch USDC balance: ${error.message || "Unknown error"}`
      );
    }
  },

  
  async getUserRecord(user: Address): Promise<UserRecord> {
    try {
      const result = (await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "userRecord",
        args: [user],
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as any[];

      const [
        totalInvestment,
        directBusiness,
        referrer,
        referrerBonus,
        totalWithdrawn,
        isRegistered,
        stakeCount,
      ] = result.map((v, i) => {
        if (i === 0 || i === 1 || i === 3 || i === 4 || i === 6) return v ?? 0n; // bigints
        if (i === 2) return v ?? "0x0000000000000000000000000000000000000000"; // address
        if (i === 5) return v ?? false; // boolean
        return v;
      });

      console.log(`User record for ${user}:`, {
        totalInvestment,
        directBusiness,
        referrer,
        referrerBonus,
        totalWithdrawn,
        isRegistered,
        stakeCount,
      });
      return {
        totalInvestment,
        directBusiness,
        referrer,
        referrerBonus,
        totalWithdrawn,
        isRegistered,
        stakeCount,
      };
    } catch (error: any) {
      console.error(`Error fetching user record: ${error.message || error}`);
      throw error;
    }
  },
  // async getStakeRecord(user: Address, index: bigint): Promise<StakeRecord> {
  //   try {
  //     const [packageIndex, lasClaimTime, rewardClaimed] = (await readContract(
  //       config,
  //       {
  //         abi: DWC_ABI,
  //         address: DWC_CONTRACT_ADDRESS,
  //         functionName: "stakeRecord",
  //         args: [user, index],
  //         chainId: BSC_TESTNET_CHAIN_ID,
  //       }
  //     )) as [bigint, bigint, bigint];
  //     console.log(`Stake record for ${user} at index ${index}:`, {
  //       packageIndex,
  //       lasClaimTime,
  //       rewardClaimed,
  //     });
  //     return { packageIndex, lasClaimTime, rewardClaimed };
  //   } catch (error: any) {
  //     console.error(`Error fetching stake record: ${error.message || error}`);
  //     throw error;
  //   }
  // },
  async getStakeRecord(user: Address, index: bigint): Promise<StakeRecord> {
    try {
      const result = (await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "stakeRecord",
        args: [user, index],
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as any[];

      const [packageIndex, lasClaimTime, rewardClaimed, maxRoi] = result.map(
        (v, i) => v ?? 0n
      ); // all are bigints

      console.log(`Stake record for ${user} at index ${index}:`, {
        packageIndex,
        lasClaimTime,
        rewardClaimed,
        maxRoi,
      });
      return { packageIndex, lasClaimTime, rewardClaimed, maxRoi };
    } catch (error: any) {
      console.error(`Error fetching stake record: ${error.message || error}`);
      throw error;
    }
  },
  async getPackagePrice(index: bigint): Promise<bigint> {
    try {
      const price = (await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "packagePrice",
        args: [index],
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as bigint;
      console.log(
        `Package price for index ${index}: ${formatUnits(price, 18)} USDC`
      );
      return price;
    } catch (error: any) {
      console.error(`Error fetching package price: ${error.message || error}`);
      throw error;
    }
  },

  async getRoiPercent(index: bigint): Promise<bigint> {
    try {
      const percent = (await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "roiPercent",
        args: [index],
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as bigint;
      console.log(`ROI percent for index ${index}: ${percent}`);
      return percent;
    } catch (error: any) {
      console.error(`Error fetching ROI percent: ${error.message || error}`);
      throw error;
    }
  },

  async getMaxRoi(): Promise<bigint> {
    try {
      const maxRoi = (await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "MAX_ROI",
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as bigint;
      console.log(`Max ROI: ${maxRoi}`);
      return maxRoi;
    } catch (error: any) {
      console.error(`Error fetching max ROI: ${error.message || error}`);
      throw error;
    }
  },

  async getContractPercent(): Promise<bigint> {
    try {
      const percent = (await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "contractPercent",
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as bigint;
      console.log(`Contract percent: ${percent}`);
      return percent;
    } catch (error: any) {
      console.error(
        `Error fetching contract percent: ${error.message || error}`
      );
      throw error;
    }
  },

  async getDirectIncome(): Promise<bigint> {
    try {
      const income = (await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "directIncome",
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as bigint;
      console.log(`Direct income: ${income}`);
      return income;
    } catch (error: any) {
      console.error(`Error fetching direct income: ${error.message || error}`);
      throw error;
    }
  },

  async getPercentDivider(): Promise<bigint> {
    try {
      const divider = (await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "percentDivider",
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as bigint;
      console.log(`Percent divider: ${divider}`);
      return divider;
    } catch (error: any) {
      console.error(
        `Error fetching percent divider: ${error.message || error}`
      );
      throw error;
    }
  },

  async getOwner(): Promise<Address> {
    try {
      const owner = (await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "owner",
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as Address;
      console.log(`Owner: ${owner}`);
      return owner;
    } catch (error: any) {
      console.error(`Error fetching owner: ${error.message || error}`);
      throw error;
    }
  },

  async getUniqueUsers(index: bigint): Promise<Address> {
    try {
      const user = (await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "uniqueUsers",
        args: [index],
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as Address;
      console.log(`Unique user at index ${index}: ${user}`);
      return user;
    } catch (error: any) {
      console.error(`Error fetching unique user: ${error.message || error}`);
      throw error;
    }
  },

  async calculateClaimAble(user: Address, index: bigint): Promise<bigint> {
    try {
      const claimable = (await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "calculateClaimAble",
        args: [user, index],
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as bigint;
      console.log(
        `Claimable amount for ${user} at index ${index}: ${formatUnits(
          claimable,
          18
        )} USDC`
      );
      return claimable;
    } catch (error: any) {
      console.error(
        `Error calculating claimable amount: ${error.message || error}`
      );
      throw error;
    }
  },

  async getUsersLength(): Promise<bigint> {
    try {
      const length = (await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "getUSersLengh",
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as bigint;
      console.log(`Users length: ${length}`);
      return length;
    } catch (error: any) {
      console.error(`Error fetching users length: ${error.message || error}`);
      throw error;
    }
  },

  async getContractBalance(): Promise<bigint> {
    try {
      const balance = (await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "getContractBalance",
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as bigint;
      console.log(`Contract balance: ${formatUnits(balance, 18)} USDC`);
      return balance;
    } catch (error: any) {
      console.error(
        `Error fetching contract balance: ${error.message || error}`
      );
      throw error;
    }
  },

  async getAllStakeReward(): Promise<bigint> {
    try {
      const reward = (await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "getallstakereward",
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as bigint;
      console.log(`All stake reward: ${formatUnits(reward, 18)} USDC`);
      return reward;
    } catch (error: any) {
      console.error(
        `Error fetching all stake reward: ${error.message || error}`
      );
      throw error;
    }
  },
  async getUSDTBalance(account: Address): Promise<bigint> {
    try {
      console.log(`Fetching USDC balance for account: ${account}`);
      const balance = (await readContract(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "balanceOf",
        args: [account],
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as bigint;
      console.log(
        `USDC balance for ${account}: ${formatUnits(balance, 18)} USDC`
      );
      return balance;
    } catch (error: any) {
      console.error(
        `Error fetching USDC balance for ${account}: ${error.message || error}`
      );
      throw new Error(
        `Failed to fetch USDC balance: ${error.message || "Unknown error"}`
      );
    }
  },

  async getUserReferrers(
    user: Address
  ): Promise<{ referrers: Address[]; count: bigint }> {
    try {
      console.log(`Calling getUserReferrers for user: ${user}`);
      const result = (await readContract(config, {
        abi: DWC_ABI,
        address: DWC_CONTRACT_ADDRESS,
        functionName: "getUserReferrers",
        args: [user],
        chainId: BSC_TESTNET_CHAIN_ID,
      })) as any[];

      console.log(`Raw result from contract:`, result);
      console.log(`Result type:`, typeof result);
      console.log(
        `Result length:`,
        Array.isArray(result) ? result.length : "not array"
      );

      if (!Array.isArray(result)) {
        console.error(`Result is not an array:`, result);
        return { referrers: [], count: 0n };
      }

      const [referrers, count] = result.map((v, i) => {
        if (i === 0) return v ?? []; // array
        if (i === 1) return v ?? 0n; // bigint
        return v;
      });

      console.log(`Processed user referrers for ${user}:`, {
        referrers,
        count,
      });
      return { referrers, count };
    } catch (error: any) {
      console.error(`Error fetching user referrers: ${error.message || error}`);
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
  getContractBalance,
  getUsersLength,
  getAllStakeReward,
  getUserReferrers,
  getUSDTBalance,
} = dwcContractInteractions;
