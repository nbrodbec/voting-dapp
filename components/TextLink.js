'use client';
import { useRouter } from 'next/navigation';

const TextLink = ({ children, href, back }) => {
  const router = useRouter();
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        if (href) {
          router.push(href);
        } else if (back) {
          router.back();
        }
      }}
      className='text-base font-medium mx-auto hover:text-lg hover:underline transition-all'
    >
      {children}
    </button>
  );
};

export default TextLink;
