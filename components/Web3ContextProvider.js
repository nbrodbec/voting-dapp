'use client';

import { ethers } from 'ethers';
import { createContext, useEffect, useState } from 'react';

export const Web3Context = createContext();

const Web3ContextProvider = ({ children }) => {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [address, setAddress] = useState('');
  const [connecting, setConnecting] = useState(false);
  
  const connect = () => {
    setConnecting(true);

    const providerObj = new ethers.BrowserProvider(window.ethereum);
    setProvider(providerObj);

    const signerPromise = providerObj.getSigner();
    signerPromise
      .then((signerObj) => {
        setSigner(signerObj);
        return signerObj.getAddress();
      })
      .then((addressStr) => {
        setAddress(addressStr);
        setConnecting(false);
      })
      .catch((e) => {
        console.log(e);
        setAddress(null);
        setSigner(null);
        setConnecting(false);
      });
  };

  useEffect(() => {
    if (window.ethereum === null) {
      // No write-access; no keys loaded with MetaMask!
      const providerObj = ethers.getDefaultProvider();
      setProvider(providerObj);
    } else {
      window.ethereum.on('connect', connect);
      window.ethereum.on('accountsChanged', connect);
      if (window.ethereum.isConnected()) connect();

      return () => {
        console.log('cleaning up');
        window.ethereum.removeListener('connect', connect);
        window.ethereum.removeListener('accountsChanged', connect);
      };
    }
  }, []);

  return (
    <Web3Context.Provider value={{ connect, connecting, provider, signer, address }}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3ContextProvider;
