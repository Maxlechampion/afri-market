
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
  cartCount, user, currentView, onOpenCart, onOpenAuth, onLogout, onSearch, onViewChange 
}) => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={() => onViewChange('store')}
          >
            <h1 className="text-2xl font-bold text-orange-600 tracking-tight">AfriMarket</h1>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-orange-500 rounded-lg py-2 pl-10 pr-4 text-sm transition-all outline-none"
                placeholder="Rechercher un produit..."
                onChange={(e) => onSearch(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <i className="fas fa-search"></i>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {user && (
              <button 
                onClick={() => onViewChange(currentView === 'store' ? 'dashboard' : 'store')}
                className="text-gray-600 hover:text-orange-600 text-sm font-bold flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg"
              >
                <i className={`fas ${currentView === 'store' ? 'fa-chart-line' : 'fa-store'}`}></i>
                <span className="hidden sm:inline">{currentView === 'store' ? 'Dashboard' : 'Boutique'}</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center space-x-4 border-l pl-4 border-gray-100">
                <span className="text-sm font-medium text-gray-700 hidden lg:block">Bonjour, {user.name}</span>
                <button 
                  onClick={onLogout}
                  className="text-gray-400 hover:text-red-500 text-sm transition-colors"
                  title="Déconnexion"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="text-gray-500 hover:text-orange-600 text-sm font-medium flex items-center"
              >
                <i className="far fa-user mr-2"></i>
                Se connecter
              </button>
            )}

            <button 
              onClick={onOpenCart}
              className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <i className="fas fa-shopping-cart text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
