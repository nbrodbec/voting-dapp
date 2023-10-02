const TextInput = ({ children, id, ...props }) => {
  return (
    <div className='flex grow flex-col'>
      <label className='font-medium' htmlFor={id}>
        {children}
      </label>
      <input
        type='text'
        id={id}
        name={id}
        maxlength={32}
        className='p-2 rounded-md focus:outline-magenta-200 placeholder-blue-50 text-blue-300 disabled:text-zinc-200 disabled:opacity-60 font-medium'
        {...props}
      />
    </div>
  );
};

export default TextInput;
