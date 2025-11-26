import React from 'react';
import { Link } from 'react-router-dom';

const Nav: React.FC = () => {
  return (
    <nav className="p-4 bg-gray-100 dark:bg-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto flex gap-4 items-center">
        <Link to="/" className="font-semibold">Usuarios</Link>
        <Link to="/create" className="text-blue-600">Crear</Link>
      </div>
    </nav>
  );
};

export default Nav;