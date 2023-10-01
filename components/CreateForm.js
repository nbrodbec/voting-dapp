'use client';

import { useContext, useState } from 'react';
import TextInput from './TextInput';
import { Web3Context } from './Web3ContextProvider';
import Button from './Button';
import MetaMask from './MetaMask';
import ConnectButton from './ConnectButton';

const CreateForm = () => {
  const { network, signer, address } = useContext(Web3Context);
  const [options, setOptions] = useState([]);

  return (
    <form className='flex flex-col gap-4 my-12'>
      <TextInput id='title' placeholder='New Poll' defaultValue='New Poll'>
        Title:
      </TextInput>
      <div className='flex flex-row gap-4 items-end'>
        <TextInput
          id='owner'
          value={address ? address : 'Wallet Not Connected'}
          disabled
        >
          Wallet {network && `(${network.name})`}:
        </TextInput>
        <MetaMask disconnected>
          <ConnectButton />
        </MetaMask>
      </div>

      <hr />
      {options.map((str, i) => (
        <div key={i} className='flex flex-row gap-4'>
          <TextInput
            id={str}
            value={str}
            onChange={(event) =>
              setOptions(
                options.map((def, j) => (i === j ? event.target.value : def))
              )
            }
          />
          <Button
            small
            color='magenta'
            onClick={() => {
              options.splice(i, 1);
              setOptions([...options]);
            }}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        small
        onClick={() => setOptions([...options, 'Option'])}
        disabled={options.length >= 10}
      >
        Add Option
      </Button>
      <hr />
      <Button color='blue' disabled={!signer || options.length === 0}>
        Create
      </Button>
    </form>
  );
};

export default CreateForm;
