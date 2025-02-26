'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiLogOut, FiShoppingCart } from 'react-icons/fi';
import { FaMoneyBill, FaHistory, FaUser } from 'react-icons/fa';
import { useAuth } from '@/lib/context/authContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  const menuItems = [
    { name: 'Despesas', path: '/conta/despesas', icon: <FaMoneyBill className="w-5 h-5" /> },
    { name: 'Histórico', path: '/conta/historico', icon: <FaHistory className="w-5 h-5" /> },
    { name: 'Perfil', path: '/conta/perfil', icon: <FaUser className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 font-montserrat font-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo com Gradiente */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex-shrink-0 z-50 group relative">
              <span className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  EcoCash
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  EcoCash
                </span>
              </span>
            </Link>
            <button 
              className="text-gray-900 hover:text-indigo-600 transition-colors"
              title="Carrinho"
            >
              <FiShoppingCart className="h-6 w-6" />
            </button>
          </div>

          {/* Menu Desktop - Links à direita */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`text-gray-900 hover:text-indigo-600 transition-colors
                    ${pathname === item.path ? 'text-indigo-600 font-medium' : ''}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {user && (
              <div className="ml-6 border-l border-gray-200 pl-6">
                <button
                  onClick={logout}
                  className="text-gray-900 hover:text-red-600 transition-colors"
                  title="Sair"
                >
                  <FiLogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Menu Mobile Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-900 hover:text-indigo-600 focus:outline-none"
            aria-label="Abrir menu"
          >
            {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 border-b">
          <span className="text-xl font-bold text-gray-900">Menu</span>
        </div>
        
        <nav className="flex flex-col p-4 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center space-x-3 p-2 rounded-lg
                ${pathname === item.path ? 
                  'bg-indigo-50 text-indigo-600' : 
                  'text-gray-900 hover:bg-gray-100'}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
          {user && (
            <button
              onClick={logout}
              className="mt-4 px-4 py-2 flex items-center space-x-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <FiLogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          )}
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}
    </nav>
  );
}