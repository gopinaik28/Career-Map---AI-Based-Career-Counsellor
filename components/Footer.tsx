
// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 text-indigo-100 dark:text-indigo-200 p-6 text-center shadow-inner mt-auto">
      <div className="container mx-auto">
        <p className="font-semibold">&copy; {new Date().getFullYear()} NSG Solutions.</p>
        <p className="text-sm opacity-80">All rights reserved. Chart your future with confidence.</p>
        <p className="text-xs mt-2 opacity-60">
          Powered by Generative AI
        </p>
      </div>
    </footer>
  );
};

export default Footer;