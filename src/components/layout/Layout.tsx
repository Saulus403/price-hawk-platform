
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-grow ${isMobile ? 'px-4 py-4' : 'container mx-auto px-4 py-6'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
