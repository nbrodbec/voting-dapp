import CreateForm from "@/components/CreateForm";

export default function Create() {
  return (
    <main className='min-h-screen p-12 grid items-start justify-center'>
      <h1 className='mb-4 text-center' value='New Poll'>Create</h1>
      <CreateForm />
    </main>
  );
}
