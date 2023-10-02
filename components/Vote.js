'use client';
import { useContext } from 'react';
import Button from './Button';
import { Web3Context } from './Web3ContextProvider';
import MetaMask from './MetaMask';
import ConnectButton from './ConnectButton';

const Vote = ({ poll, setPoll }) => {
  const { signer } = useContext(Web3Context);
  return (
    <>
      <div className='flex flex-col justify-evenly text-center'>
        <div className='flex flex-col gap-4 justify-center my-4 md:mx-36'>
          {poll?.options?.map((v, i) => (
            <Button
              key={i}
              disabled={signer === null}
              onClick={async () => {
                const connectedContract = poll.contract.connect(signer);
                if (connectedContract) {
                  connectedContract
                    .vote(i)
                    .then((txRes) => {
                      setPoll({
                        ...poll,
                        response: 'Vote initiated...',
                      });
                      return txRes.wait();
                    })
                    .then((txReceipt) => {
                      if (txReceipt) {
                        setPoll({
                          ...poll,
                          response: 'Vote confirmed!',
                          responseConfirmed: true,
                        });
                      } else {
                        setPoll({
                          ...poll,
                          response: 'Transaction Failed',
                        });
                      }
                    })
                    .catch((e) => {
                      if (e.data && connectedContract) {
                        const decodedErr =
                          connectedContract.interface.parseError(e.data);
                        setPoll({
                          ...poll,
                          response: `Transaction Failed: ${decodedErr?.args}`,
                        });
                      } else {
                        setPoll({
                          ...poll,
                          response: 'An Error Occured',
                        });
                      }
                    });
                } else {
                  connect();
                }
              }}
            >
              {v}
            </Button>
          ))}
        </div>
        <p>
          Total Votes:{' '}
          {poll.votes.reduce((acc, cur, i) =>
            i < poll.options.length ? acc + cur : acc
          )}
        </p>
      </div>
      <MetaMask disconnected>
        <ConnectButton />
      </MetaMask>
    </>
  );
};

export default Vote;
