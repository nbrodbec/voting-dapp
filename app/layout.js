import Web3ContextProvider from '@/components/Web3ContextProvider';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Voting DApp',
  description: 'Created by Nicholas Brodbeck',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <Web3ContextProvider>
        <body className={inter.className + ' min-h-screen'}>{children}</body>
      </Web3ContextProvider>
    </html>
  );
}
