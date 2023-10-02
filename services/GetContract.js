import { ethers } from 'ethers';
import contractData from '@/artifacts/contracts/Poll.sol/Poll.json';

export default async function GetContract(address, provider) {
  try {
    const contract = await new ethers.BaseContract(address, contractData.abi, provider);
    const code = await provider.getCode(address);
    if (code === null || code === '0x') {
      return false;
    } else {
      return contract;
    }
  } catch(err) {
    console.log(err);
  }
}
