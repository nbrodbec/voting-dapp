import ConnectButton from '@/components/ConnectButton';
import MetaMask from '@/components/MetaMask';

export default function Manage() {
  return (
    <>
      <MetaMask connected>
        <main className='min-h-screen p-12 flex flex-col justify-center'>
          <h1 className='text-center'>My Polls</h1>
          <div className='grow'>
            <h2>Created</h2>
          </div>
          <div className='grow'>
            <h2>Voted</h2>
          </div>
        </main>
      </MetaMask>
      <MetaMask disconnected>
        <main className='min-h-screen p-12 flex flex-col justify-center items-center gap-4'>
          <h2>Please Connect a Wallet</h2>
          <ConnectButton />
        </main>
      </MetaMask>
    </>
  );
}
