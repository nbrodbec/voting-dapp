'use client';
import Button from '@/components/Button';
import Locked from '@/components/Locked';
import OwnerControls from '@/components/OwnerControls';
import Register from '@/components/Register';
import TextLink from '@/components/TextLink';
import Vote from '@/components/Vote';
import { Web3Context } from '@/components/Web3ContextProvider';
import GetContract from '@/services/GetContract';
import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';

const Phases = {
  REGISTRATION: 0,
  VOTING: 1,
  LOCKED: 2,
};

export default function PollPage({ params }) {
  const { address, connect, provider } = useContext(Web3Context);
  const [poll, setPoll] = useState();

  useEffect(() => {
    if (!provider) {
      connect();
      return;
    }

    let cleanup;
    const code = params.code;
    fetch('/api/poll?' + new URLSearchParams({ code: code, type: 'code' }), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((address) => {
        if (address) {
          return GetContract(address, provider);
        } else {
          setPoll(false);
        }
      })
      .then(async (contract) => {
        if (contract) {
          const title = await contract.title();
          const options = await contract.getOptions();
          const phase = await contract.currentPhase();
          const votes = await contract.getVotes();
          const owner = await contract.owner();
          const numVoters = await contract.numVoters();
          const address = await contract.getAddress();

          setPoll({
            title: ethers.decodeBytes32String(title),
            options: options
              .map((s) => ethers.decodeBytes32String(s))
              .filter((s) => s !== ''),
            phase: Number(phase),
            votes: votes.map((v) => Number(v)),
            owner: owner,
            numVoters: Number(numVoters),
            address: address,
            contract: contract,
          });

          contract.on('Vote', (ballot) =>
            setPoll(p => ({
              ...p,
              votes: votes.map((v, i) => (i === Number(ballot) ? v + 1 : v)),
            }))
          );

          contract.on('PhaseChange', (newPhase) =>
            setPoll(p => ({
              ...p,
              phase: Number(newPhase),
            }))
          );

          contract.on('Register', () =>
            setPoll(p => ({
              ...p,
              numVoters: numVoters + 1,
            }))
          );

          cleanup = () => {
            contract.off('Register');
            contract.off('Vote');
            contract.off('PhaseChange');
          };
        } else {
          setPoll(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setPoll(false);
      });

    return () => {
      if (cleanup) cleanup();
    };
  }, [provider, connect]);

  return (
    <main className='p-12 flex flex-col gap-12 min-h-screen justify-between text-center'>
      {poll === false ? (
        <>
          <h1>Oops!</h1>
          <h2>Can't find a poll with code {params.code}!</h2>
        </>
      ) : poll === undefined ? (
        <>
          <h1>{params.code}</h1>
          <h2>Loading...</h2>
        </>
      ) : poll?.response ? (
        <>
          <div className='my-auto space-y-4 text-center'>
            <h2 className='my-auto'>{poll.response}</h2>
            {poll.responseConfirmed && (
              <Button
                color='magenta'
                onClick={() =>
                  setPoll({ ...poll, response: null, responseConfirmed: false })
                }
              >
                Ok
              </Button>
            )}
          </div>
        </>
      ) : poll ? (
        <>
          <h1>{poll.title}</h1>
          {poll.phase === Phases.REGISTRATION ? (
            <Register poll={poll} setPoll={setPoll} />
          ) : poll.phase === Phases.VOTING ? (
            <Vote poll={poll} setPoll={setPoll} />
          ) : poll.phase === Phases.LOCKED ? (
            <Locked poll={poll} />
          ) : (
            <h2>Error</h2>
          )}
          {poll.owner === address && (
            <OwnerControls poll={poll} setPoll={setPoll} />
          )}
          <div>
            <h2>Code: {params.code}</h2>
            <div className='flex flex-col gap-2 justify-center md:flex-row'>
              <h3>Contract Address:</h3>
              <div className='overflow-x-auto'>{poll.address}</div>
            </div>
          </div>
        </>
      ) : (
        <h2>Unknown Error</h2>
      )}

      <TextLink back>Back</TextLink>
    </main>
  );
}
