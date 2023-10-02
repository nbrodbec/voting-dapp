'use client';
import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import TextLink from '@/components/TextLink';
import { Web3Context } from '@/components/Web3ContextProvider';
import GetContract from '@/services/GetContract';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

export default function Submit() {
  const [input, setInput] = useState('');
  const { signer } = useContext(Web3Context);
  const router = useRouter();
  return (
    <main className='p-12 min-h-screen flex flex-col items-center justify-between'>
      <h1>Submit</h1>
      <form className='flex flex-row justify-center items-center gap-4'>
        <div>
          <TextInput
            placeholder='Input poll code or address...'
            id='code'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <Button
          small
          disabled={input.length !== 5 && !ethers.isAddress(input)}
          onClick={async () => {
            if (ethers.isAddress(input)) {
              const poll = await GetContract(input, signer);
              if (poll) {
                console.log(await poll.numVoters());
              }
            } else if (input.length === 5) {
              router.push(`/submit/${input.toUpperCase()}`);
            }
          }}
        >
          Submit
        </Button>
      </form>
      <TextLink back>Back</TextLink>
    </main>
  );
}
