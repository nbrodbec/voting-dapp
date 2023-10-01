const { default: Link } = require('next/link');

const TextLink = ({ children, href }) => {
  return (
    <Link href={href} className='text-base font-medium mx-auto hover:text-lg hover:underline transition-all'>
      {children}
    </Link>
  );
};

export default TextLink;
