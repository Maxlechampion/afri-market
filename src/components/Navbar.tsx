import React from 'react';
import { User } from '../types';

interface NavbarProps {
  cartCount: number;
  user: User | null;
  currentView: 'store' | 'dashboard';
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSearch: (term: string) => void;
  onViewChange: (view: 'store' | 'dashboard') => void;
}

const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  user,
  currentView,
  onOpenCart,
  onOpenAuth,
  onLogout,
  onSearch,
  onViewChange,
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button 
            onClick={() => onViewChange('store')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-shopping-bag text-white font-black"></i>
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">AfriMarket</span>
          </button>

          {/* Search Bar */}
          {currentView === 'store' && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <input
                type="text"
                placeholder="Rechercher produits..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full px-6 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
              />
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {/* Dashboard Toggle */}
            {user && (
              <button
                onClick={() => onViewChange(currentView === 'store' ? 'dashboard' : 'store')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <i className={`fas ${currentView === 'dashboard' ? 'fa-shop' : 'fa-chart-line'} mr-2`}></i>
                {currentView === 'dashboard' ? 'Boutique' : 'Tableau de Bord'}
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-3 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <i className="fas fa-shopping-cart text-gray-900 text-lg"></i>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-orange-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {!user ? (
              <button
                onClick={onOpenAuth}
                className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all"
              >
                Connexion
              </button>
            ) : (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{user.role}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-xs font-black text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {currentView === 'store' && (
          <div className="md:hidden pb-4">
            <input
              type="text"
              placeholder="Rechercher..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;