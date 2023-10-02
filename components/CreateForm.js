'use client';

import { useContext, useRef, useState } from 'react';
import TextInput from './TextInput';
import { Web3Context } from './Web3ContextProvider';
import Button from './Button';
import MetaMask from './MetaMask';
import ConnectButton from './ConnectButton';
import CreateContract from '@/services/CreateContract';
import { useRouter } from 'next/navigation';

const CreateForm = () => {
  const { network, signer, address } = useContext(Web3Context);
  const [options, setOptions] = useState([]);
  const [title, setTitle] = useState('New Poll');
  const router = useRouter();

  return (
    <form className='flex flex-col gap-4 my-12'>
      <TextInput
        id='title'
        placeholder='New Poll'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      >
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
            placeholder={`Option ${i}`}
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
        onClick={() => setOptions([...options, ''])}
        disabled={options.length >= 10}
      >
        Add Option
      </Button>
      <hr />
      <Button
        color='blue'
        disabled={!signer || options.length === 0}
        onClick={async () => {
          const code = await CreateContract(title, options, signer);
          if (code) {
            router.push(`/submit/${code.toUpperCase()}`);
          }
        }}
      >
        Create
      </Button>
    </form>
  );
};

export default CreateForm;
