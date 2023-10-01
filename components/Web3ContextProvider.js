'use client';

import { ethers } from 'ethers';
import { createContext, useEffect, useState } from 'react';

export const Web3Context = createContext();

const Web3ContextProvider = ({ children }) => {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [address, setAddress] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [network, setNetwork] = useState();
  
  const connect = () => {
    setConnecting(true);

    const providerObj = new ethers.BrowserProvider(window.ethereum);
    setProvider(providerObj);

    // Get provider info
    providerObj.getNetwork().then(setNetwork);

    // Get signer and address
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
      window.ethereum.on('chainChanged', connect);
      if (window.ethereum.isConnected()) connect();

      return () => {
        console.log('cleaning up');
        window.ethereum.removeListener('connect', connect);
        window.ethereum.removeListener('accountsChanged', connect);
        window.ethereum.removeListener('chainChanged', connect);
      };
    }
  }, []);

  return (
    <Web3Context.Provider value={{ address, connect, connecting, network, provider, signer }}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3ContextProvider;
