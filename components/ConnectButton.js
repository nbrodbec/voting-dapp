'use client';
import Button from '@/components/Button';
import { useContext } from 'react';
import { Web3Context } from './Web3ContextProvider';

const ConnectButton = ({ small }) => {
  const { connect, connecting } = useContext(Web3Context);
  return (
    <Button small color='magenta' disabled={connecting} onClick={() => connect()}>
      Connect MetaMask
    </Button>
  );
};

export default ConnectButton;
