'use client';
import Button from '@/components/Button';
import ConnectButton from '@/components/ConnectButton';
import MetaMask from '@/components/MetaMask';
import TextLink from '@/components/TextLink';
import { Web3Context } from '@/components/Web3ContextProvider';
import { useContext, useEffect, useState } from 'react';

export default function Manage() {
  const { address } = useContext(Web3Context);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    fetch(
      '/api/poll?' + new URLSearchParams({ type: 'owner', owner: address }),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((polls) => {
        if (polls) {
          console.log(polls);
          setAddresses(polls.map(([code, addr]) => code));
        } else {
          console.log('NONE');
        }
      })
      .catch(console.dir);
  }, [address]);
  return (
    <>
      <MetaMask connected>
        <main className='min-h-screen p-12 flex flex-col space-y-8 justify-between items-center'>
          <h1 className='text-center'>My Polls</h1>
          <div className='grid grid-cols-3 grid-flow-row gap-4 md:grid-cols-4'>
            {addresses.map((code, i) => (
                <Button key={i} href={`/submit/${code}`}>{code}</Button>
            ))}
          </div>
          <TextLink back>Back</TextLink>
        </main>
      </MetaMask>
      <MetaMask disconnected>
        <main className='min-h-screen p-12 flex flex-col justify-center items-center gap-4'>
          <h2>Please Connect a Wallet</h2>
          <ConnectButton />
        </main>
      </MetaMask>
    </>
  );
}
