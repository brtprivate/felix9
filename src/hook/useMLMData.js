import { useState, useEffect } from "react";
import { formatUnits } from "viem";
import { dwcContractInteractions } from "../services/contractService";
import { TESTNET_CHAIN_ID } from "../services/contractService";

const useMLMData = (wallet, chainId, switchChain, setError, setIsLoading) => {
  const [mlmData, setMlmData] = useState({
    totalInvestment: 0,
    referrerBonus: 0,
    isRegistered: false,
    stakeCount: 0,
    usdcBalance: 0,
    totalUsers: 0,
    directIncome: 0,
    contractPercent: 0,
    maxRoi: 0,
    contractBalance: 0,
    directBusiness: 0,
    referrer: '',
    totalWithdrawn: 0,
  });
  const [stakes, setStakes] = useState([]);
  const [notRegistered, setNotRegistered] = useState(false);

  const packages = [
    {
      name: "Starter Pack",
      index: 1,
      functionName: "buyStaterPack",
      features: ["Basic ROI", "Entry Level", "Referral Bonus"],
    },
    {
      name: "Silver Pack",
      index: 2,
      functionName: "buySilverPack",
      features: ["Enhanced ROI", "Silver Benefits", "Higher Referral Bonus"],
    },
    {
      name: "Gold Pack",
      index: 3,
      functionName: "buyGoldPack",
      features: ["Premium ROI", "Gold Benefits", "Premium Referral Bonus"],
    },
    {
      name: "Platinum Pack",
      index: 4,
      functionName: "buyPlatinumPack",
      features: ["Platinum ROI", "VIP Benefits", "Elite Referral Bonus"],
    },
    {
      name: "Diamond Pack",
      index: 5,
      functionName: "buyDiamondPack",
      features: ["Diamond ROI", "Diamond Benefits", "Maximum Referral Bonus"],
    },
    {
      name: "Elite Pack",
      index: 6,
      functionName: "buyElitePack",
      features: ["Elite ROI", "Elite Benefits", "Elite Referral Bonus"],
    },
    {
      name: "Premium Pack",
      index: 7,
      functionName: "buyPremiumPack",
      features: ["Premium ROI", "Premium Benefits", "Premium Referral Bonus"],
    },
    {
      name: "Mega Pack",
      index: 8,
      functionName: "buyMegaPack",
      features: ["Mega ROI", "Mega Benefits", "Mega Referral Bonus"],
    },
    {
      name: "Pro Pack",
      index: 9,
      functionName: "buyProPack",
      features: ["Pro ROI", "Professional Benefits", "Pro Referral Bonus"],
    },
    {
      name: "Infinity Pack",
      index: 10,
      functionName: "buyInfinityPack",
      features: [
        "Infinity ROI",
        "Infinity Benefits",
        "Infinity Referral Bonus",
      ],
    },
    {
      name: "Titan Pack",
      index: 11,
      functionName: "buyTitanPack",
      features: ["Titan ROI", "Titan Benefits", "Titan Referral Bonus"],
    },
    {
      name: "Galaxy Pack",
      index: 12,
      functionName: "buyGalaxyPack",
      features: ["Galaxy ROI", "Galaxy Benefits", "Galaxy Referral Bonus"],
    },
    {
      name: "Royal Pack",
      index: 13,
      functionName: "buyRoyalPack",
      features: ["Royal ROI", "Royal Benefits", "Royal Referral Bonus"],
    },
    {
      name: "Legend Pack",
      index: 14,
      functionName: "buyLegendPack",
      features: ["Legend ROI", "Legend Benefits", "Legend Referral Bonus"],
    },
  ];

  const fetchMlmData = async () => {
    if (!wallet.isConnected || !wallet.account) {
      setError("Wallet not connected. Please connect your wallet.");
      return;
    }

    if (chainId !== TESTNET_CHAIN_ID) {
      try {
        await switchChain({ chainId: TESTNET_CHAIN_ID });
      } catch (error) {
        setError("Please switch to BSC Testnet.");
        return;
      }
    }

    try {
      setIsLoading(true);
      setError("");

      let userRecord;
      try {
        userRecord = await dwcContractInteractions.getUserRecord(
          wallet.account
        );
      } catch (error) {
        console.warn(
          "User record not found, user may not be registered:",
          error
        );
        userRecord = {
          totalInvestment: 0n,
          referrer: "0x0000000000000000000000000000000000000000",
          referrerBonus: 0n,
          isRegistered: false,
          stakeCount: 0n,
          directBusiness: 0n,
          totalWithdrawn: 0n,
        };
      }

      const [usdcBalanceRaw, directIncome, contractPercent, maxRoi, contractBalanceRaw, totalUsersRaw] =
        await Promise.all([
          dwcContractInteractions.getUSDCBalance(wallet.account),
          dwcContractInteractions.getDirectIncome(),
          dwcContractInteractions.getContractPercent(),
          dwcContractInteractions.getMaxRoi(),
          dwcContractInteractions.getContractBalance(),
          dwcContractInteractions.getUsersLength(),
        ]);

      const stakeRecords = [];

      console.log("🔎 Checking user stake records...");
      console.log("User registered:", userRecord.isRegistered);
      console.log("User stake count:", userRecord.stakeCount);

      // if (userRecord.isRegistered && Number(userRecord.stakeCount) > 0) {
      //   for (let i = 0; i < Number(userRecord.stakeCount); i++) {
      //     console.log(`\n📌 Processing stake #${i}...`);
      //     try {
      //       const stake = await dwcContractInteractions.getStakeRecord(
      //         wallet.account,
      //         BigInt(i)
      //       );
      //       console.log("✅ Stake record fetched:", stake);

      //       // Adjust packageIndex to account for 1-based indexing
      //       const adjustedPackageIndex = Number(stake.packageIndex);
      //       console.log("📦 Adjusted package index:", adjustedPackageIndex);

      //       const packagePrice = await dwcContractInteractions.getPackagePrice(
      //         BigInt(adjustedPackageIndex)
      //       );
      //       console.log("💰 Package price (raw):", packagePrice.toString());

      //       const roiPercent = await dwcContractInteractions.getRoiPercent(
      //         BigInt(adjustedPackageIndex)
      //       );
      //       console.log("📈 ROI Percent:", roiPercent.toString());

      //       const claimable = await dwcContractInteractions.calculateClaimAble(
      //         wallet.account,
      //         BigInt(i)
      //       );
      //       console.log("🎯 Claimable amount (raw):", claimable.toString());

      //       // Find the package with the adjusted index
      //       const packageInfo = packages.find(
      //         (pkg) => pkg.index === adjustedPackageIndex
      //       );
      //       console.log("📦 Matched package info:", packageInfo);

      //       const formattedStake = {
      //         index: i,
      //         packageIndex: adjustedPackageIndex,
      //         packageName:
      //           packageInfo?.name || `Package ${adjustedPackageIndex}`,
      //         packagePrice: parseFloat(formatUnits(packagePrice, 18)),
      //         roiPercent: Number(roiPercent),
      //         lastClaimTime: Number(stake.lasClaimTime), // ⚠️ Typo? Should be 'lastClaimTime'
      //         rewardClaimed: parseFloat(formatUnits(stake.rewardClaimed, 18)),
      //         claimable: parseFloat(formatUnits(claimable, 18)),
      //       };

      //       console.log("📊 Final formatted stake:", formattedStake);

      //       stakeRecords.push(formattedStake);
      //     } catch (e) {
      //       console.error(`❌ Error fetching stake #${i}:`, e);
      //     }
      //   }
      // } else {
      //   console.log("⚠️ User not registered or no stakes found.");
      // }
    console.log("userRecord",userRecord)
if (userRecord.isRegistered && Number(userRecord.stakeCount) > 0) {
  for (let i = 0; i < Number(userRecord.stakeCount); i++) {
    console.log(`\n📌 Processing stake #${i}...`);
    try {
      const stake = await dwcContractInteractions.getStakeRecord(
        wallet.account,
        BigInt(i)
      );
      console.log("✅ Stake record fetched:", stake);

      // Adjust packageIndex to account for 1-based indexing
      const adjustedPackageIndex = Number(stake.packageIndex);
      console.log("📦 Adjusted package index:", adjustedPackageIndex);

      // Validate package index
      if (adjustedPackageIndex < 1 || adjustedPackageIndex > 14) {
        console.error(`Invalid package index: ${adjustedPackageIndex}`);
        continue;
      }

      const packagePrice = await dwcContractInteractions.getPackagePrice(
        BigInt(adjustedPackageIndex)
      );
      if (!packagePrice) {
        console.error(`No package price for index ${adjustedPackageIndex}`);
        continue;
      }
      console.log("💰 Package price (raw):", packagePrice.toString());

      const roiPercent = await dwcContractInteractions.getRoiPercent(
        BigInt(adjustedPackageIndex)
      );
      if (!roiPercent) {
        console.error(`No ROI percent for index ${adjustedPackageIndex}`);
        continue;
      }
      console.log("📈 ROI Percent:", roiPercent.toString());

      const claimable = await dwcContractInteractions.calculateClaimAble(
        wallet.account,
        BigInt(i)
      );
      if (!claimable) {
        console.error(`No claimable amount for stake #${i}`);
        continue;
      }
      console.log("🎯 Claimable amount (raw):", claimable.toString());

      // Find the package with the adjusted index
      const packageInfo = packages.find(
        (pkg) => pkg.index === adjustedPackageIndex
      );
      console.log("📦 Matched package info:", packageInfo);

      const formattedStake = {
        index: i,
        packageIndex: adjustedPackageIndex,
        packageName: packageInfo?.name || `Package ${adjustedPackageIndex}`,
        packagePrice: parseFloat(formatUnits(packagePrice, 18)),
        roiPercent: Number(roiPercent),
        lastClaimTime: Number(stake.lasClaimTime), // Fixed typo
        rewardClaimed: parseFloat(formatUnits(stake.rewardClaimed, 18)),
        claimable: parseFloat(formatUnits(claimable, 18)),
      };

      console.log("📊 Final formatted stake:", formattedStake);
      stakeRecords.push(formattedStake);
    } catch (e) {
      console.error(`❌ Error fetching stake #${i}:`, e);
    }
  }
} else {
  console.log("⚠️ User not registered or no stakes found.");
}
      console.log(
        "✅ All stakes processed. Total records:",
        stakeRecords.length
      );
      setStakes(stakeRecords);

      setMlmData({
        totalInvestment: parseFloat(
          formatUnits(userRecord.totalInvestment, 18)
        ),
        referrerBonus: parseFloat(formatUnits(userRecord.referrerBonus, 18)),
        isRegistered: userRecord.isRegistered,
        stakeCount: Number(userRecord.stakeCount),
        usdcBalance: parseFloat(formatUnits(usdcBalanceRaw, 18)),
        totalUsers: Number(totalUsersRaw),
        directIncome: parseFloat(formatUnits(directIncome, 18)),
        contractPercent: Number(contractPercent),
        maxRoi: parseFloat(formatUnits(maxRoi, 18)),
        contractBalance: parseFloat(formatUnits(contractBalanceRaw, 18)),
        directBusiness: parseFloat(formatUnits(userRecord.directBusiness, 18)),
        referrer: userRecord.referrer,
        totalWithdrawn: parseFloat(formatUnits(userRecord.totalWithdrawn, 18)),
      });

      setNotRegistered(!userRecord.isRegistered);
    } catch (error) {
      console.error("Error fetching MLM data:", error);
      setError("Failed to fetch MLM data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.isConnected && wallet.account) {
      fetchMlmData();
    }
  }, [wallet.isConnected, wallet.account, chainId]);

  return { mlmData, stakes, fetchMlmData, notRegistered };
};

export default useMLMData;
