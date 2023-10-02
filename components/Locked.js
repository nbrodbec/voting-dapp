const Locked = ({ poll }) => {
  let valid = 0;
  let spoilt = 0;

  poll.votes.forEach((num, i) => {
    if (i < poll.options.length) {
      valid += num;
    } else {
      spoilt += num;
    }
  });

  const didntVote = poll.numVoters - (valid + spoilt);

  return (
    <div>
      <h2>Final Results</h2>
      <div className='flex flex-col gap-4 my-8'>
        {poll.votes.map((num, i) => {
          if (i < poll.options.length) {
            return (
              <div key={i} className='relative flex flex-row justify-between rounded-md font-regular bg-pink-100 font-medium shadow-md p-4'>
                <span
                  className='absolute h-full bg-pink-300 -m-4 rounded-md'
                  style={{ width: `${(num / valid) * 100}%` }}
                />
                <h3 className='text-left z-10'>{poll.options[i]}</h3>
                <h3 className='text-right z-10'>{num}</h3>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Locked;
