'use client';
import { useContext } from 'react';
import Button from './Button';
import { Web3Context } from './Web3ContextProvider';

const Register = ({ poll, setPoll }) => {
  const { signer } = useContext(Web3Context);
  return (
    <>
      <div className='my-auto space-y-4'>
        <div className='flex flex-col gap-4 justify-center md:mx-36'>
          {poll.options.map((v, i) => (
            <Button key={i} disabled>
              {v}
            </Button>
          ))}
          <Button
            color='blue'
            disabled={signer === null}
            onClick={() => {
              const connectedContract = poll.contract.connect(signer);
              if (connectedContract) {
                connectedContract
                  .register()
                  .then((txRes) => {
                    setPoll({
                      ...poll,
                      response: 'Registration initiated...',
                    });
                    return txRes.wait();
                  })
                  .then((txReceipt) => {
                    if (txReceipt) {
                      setPoll({
                        ...poll,
                        response:
                          'Registration confirmed! Come back during the voting phase to cast your vote.',
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
                      const decodedErr = connectedContract.interface.parseError(
                        e.data
                      );
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
              }
            }}
          >
            Register to Vote
          </Button>
        </div>

        <p>Currently registered: {poll.numVoters}</p>
      </div>
      <MetaMask disconnected>
        <ConnectButton />
      </MetaMask>
    </>
  );
};

export default Register;
