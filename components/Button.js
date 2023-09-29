'use client';
import { useRouter } from 'next/navigation';

const COLORS = {
  blue: 'bg-blue-200 hover:bg-blue-300',
  pink: 'bg-pink-200 hover:bg-pink-300',
  coral: 'bg-coral-200 hover:bg-coral-300',
  magenta: 'bg-magenta-200 hover:bg-magenta-300',
};
const DISABLED = 'opacity-40 pointer-events-none';

const Button = ({
  children,
  color = 'pink',
  onClick = () => {},
  href,
  disabled,
  small,
}) => {
  const router = useRouter();
  return (
    <button
      className={`${
        small ? 'p-2' : 'p-4'
      } rounded-md font-regular font-medium shadow-md transition-colors duration-300 ${
        COLORS[color]
      } ${disabled && DISABLED}`}
      onClick={(e) => {
        e.preventDefault();
        if (href) {
          router.push(href);
        } else {
          onClick();
        }
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
