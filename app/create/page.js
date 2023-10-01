import CreateForm from '@/components/CreateForm';
import TextLink from '@/components/TextLink';

export default function Create() {
  return (
    <main className='min-h-screen p-12 flex flex-col items-center justify-between'>
      <h1 className='text-center'>
        Create
      </h1>
      <CreateForm />
      <TextLink href='/'>Cancel</TextLink>
    </main>
  );
}
