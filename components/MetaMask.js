'use client';
import { useContext } from 'react';
import { Web3Context } from './Web3ContextProvider';

const MetaMask = ({ children, connected, disconnected }) => {
  const { signer } = useContext(Web3Context);
  if (!connected) connected = !disconnected;
  return (
    <span
      className={connected ? !signer && 'hidden' : signer && 'hidden'}
    >
      {children}
    </span>
  );
};

export default MetaMask;
