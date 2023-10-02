import { ethers } from 'ethers';
import contractData from '@/artifacts/contracts/Poll.sol/Poll.json';

const baseContractFactory = new ethers.ContractFactory(
  contractData.abi,
  contractData.bytecode
);

async function CreateContract(title, options, signer) {
  if (options?.length <= 10 && signer) {
    const encodedTitle = ethers.encodeBytes32String(title);
    const encodedOptions = new Array(10)
      .fill(0)
      .map((_, i) => (i < options.length ? options[i] : ''))
      .map((s) => ethers.encodeBytes32String(s));
    try {
      const poll = await baseContractFactory
        .connect(signer)
        .deploy(encodedTitle, encodedOptions);

      const response = await fetch('/api/poll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signerAddress: await signer.getAddress(),
          contractAddress: poll.target,
        }),
      });

      await poll.waitForDeployment();

      let code = await response.json();

      return code;
    } catch (err) {
      console.dir(err);
      return false;
    }
  } else {
    console.log('Requirements not met');
  }
}

export default CreateContract;