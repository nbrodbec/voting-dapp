'use client';
const { useContext } = require('react');
const { Web3Context } = require('./Web3ContextProvider');
const { default: Button } = require('./Button');

const OwnerControls = ({ poll, setPoll }) => {
  const { signer } = useContext(Web3Context);

  return (poll.phase < 2 &&
    <div>
      <Button
        color='magenta'
        onClick={() => {
          const connectedContract = poll.contract.connect(signer);
          if (connectedContract) {
            connectedContract
              .nextPhase()
              .then((txRes) => {
                setPoll({
                  ...poll,
                  response: 'Phase switch initiated...',
                });
                return txRes.wait();
              })
              .then((txReceipt) => {
                if (txReceipt) {
                  setPoll({
                    ...poll,
                    response: 'Phase succesfully switched!',
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
        Next Phase
      </Button>
    </div>
  );
};

export default OwnerControls;
