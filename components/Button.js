const Button = ({ children }) => {
  return (
    <button className='p-4 bg-pink-200 rounded-md font-regular font-medium shadow-md hover:bg-pink-300 transition-colors duration-300'>
      {children}
    </button>
  );
};

export default Button;
