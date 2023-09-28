import Button from '@/components/Button';

export default function Home() {
  return (
    <main className='p-12 min-h-screen grid place-items-center grid-rows-1 grid-cols-1 md:grid-cols-12'>
      <div className='flex flex-col gap-8 md:col-span-7'>
        <h1 className='text-6xl font-bold text-center md:text-7xl md:text-left'>
          Voting Made Easy
        </h1>
        <p className='text-lg font-medium text-center md:text-xl md:text-left'>
          A <span className='text-coral-200'>decentralized</span> voting
          platform built on{' '}
          <span className='text-blue-50'>Smart Contracts</span> guarantees fair,
          secure, and pseudonymous election or poll results.
        </p>
        <div className='flex flex-row justify-center gap-4 md:justify-start'>
          <Button>Create a Poll</Button>
          <Button>Submit a Vote</Button>
        </div>
      </div>
    </main>
  );
}
