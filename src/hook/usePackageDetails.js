import { useState, useEffect } from 'react';
import { formatUnits } from 'viem';
import { dwcContractInteractions } from '../services/contractService';

const usePackageDetails = () => {
  const [packageDetails, setPackageDetails] = useState([]);

  const packages = [
    { name: 'Starter Pack', index: 1, functionName: 'buyStarterPack', price: 100, roiPercent: 1, features: ['Basic ROI', 'Entry Level', 'Referral Bonus'] },
    { name: 'Silver Pack', index: 2, functionName: 'buySilverPack', price: 200, roiPercent: 1, features: ['Enhanced ROI', 'Silver Benefits', 'Higher Referral Bonus'] },
    { name: 'Gold Pack', index: 3, functionName: 'buyGoldPack', price: 300, roiPercent: 1, features: ['Premium ROI', 'Gold Benefits', 'Premium Referral Bonus'] },
    { name: 'Platinum Pack', index: 4, functionName: 'buyPlatinumPack', price: 400, roiPercent: 1, features: ['Platinum ROI', 'VIP Benefits', 'Elite Referral Bonus'] },
    { name: 'Diamond Pack', index: 5, functionName: 'buyDiamondPack', price: 500, roiPercent: 1, features: ['Diamond ROI', 'Diamond Benefits', 'Maximum Referral Bonus'] },
    { name: 'Elite Pack', index: 6, functionName: 'buyElitePack', price: 600, roiPercent: 1, features: ['Elite ROI', 'Elite Benefits', 'Elite Referral Bonus'] },
    { name: 'Premium Pack', index: 7, functionName: 'buyPremiumPack', price: 700, roiPercent: 1, features: ['Premium ROI', 'Premium Benefits', 'Premium Referral Bonus'] },
    { name: 'Mega Pack', index: 8, functionName: 'buyMegaPack', price: 800, roiPercent: 1, features: ['Mega ROI', 'Mega Benefits', 'Mega Referral Bonus'] },
    { name: 'Pro Pack', index: 9, functionName: 'buyProPack', price: 900, roiPercent: 1, features: ['Pro ROI', 'Professional Benefits', 'Pro Referral Bonus'] },
    { name: 'Infinity Pack', index: 10, functionName: 'buyInfinityPack', price: 1000, roiPercent: 1, features: ['Infinity ROI', 'Infinity Benefits', 'Infinity Referral Bonus'] },
    { name: 'Titan Pack', index: 11, functionName: 'buyTitanPack', price: 2000, roiPercent: 1, features: ['Titan ROI', 'Titan Benefits', 'Titan Referral Bonus'] },
    { name: 'Galaxy Pack', index: 12, functionName: 'buyGalaxyPack', price: 3000, roiPercent: 1, features: ['Galaxy ROI', 'Galaxy Benefits', 'Galaxy Referral Bonus'] },
    { name: 'Royal Pack', index: 13, functionName: 'buyRoyalPack', price: 4000, roiPercent: 1, features: ['Royal ROI', 'Royal Benefits', 'Royal Referral Bonus'] },
    { name: 'Legend Pack', index: 14, functionName: 'buyLegendPack', price: 5000, roiPercent: 1.2, features: ['Legend ROI', 'Legend Benefits', 'Legend Referral Bonus'] },
  ];

  const fetchPackageDetails = () => {
    setPackageDetails(packages);
  };

  useEffect(() => {
    fetchPackageDetails();
  }, []);

  return { packageDetails, packages };
};

export default usePackageDetails;