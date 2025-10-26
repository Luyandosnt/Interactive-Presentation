// components/NavBar.tsx
import React from 'react';

const NavBar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-6 bg-black bg-opacity-50 text-white">
      <div className="text-xl font-bold">Radika</div>
      <div className="flex space-x-4">
        <a href="#" className="hover:underline">Manifesto</a>
        <a href="#" className="hover:underline">Careers</a>
        <button className="hover:underline">Log in</button>
        <button className="px-4 py-2 bg-white text-black rounded hover:bg-gray-300">Sign up</button>
      </div>
    </nav>
  );
};

export default NavBar;
