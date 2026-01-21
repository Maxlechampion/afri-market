
import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, q: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, items, onClose, onRemove, onUpdateQuantity, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formattedPrice = (price: number) => new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0
  }).format(price);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <i className="fas fa-shopping-basket mr-3 text-orange-600"></i>
            Votre Panier
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <i className="fas fa-times text-gray-400"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-shopping-cart text-gray-300 text-4xl"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Votre panier est vide</h3>
              <p className="text-gray-500 mb-8">On dirait que vous n'avez pas encore fait votre choix.</p>
              <button 
                onClick={onClose}
                className="bg-orange-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-700 transition-colors"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900 truncate pr-4">{item.name}</h4>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <i className="far fa-trash-alt"></i>
                      </button>
                    </div>
                    <p className="text-orange-600 font-bold mb-3">{formattedPrice(item.price)}</p>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 hover:bg-gray-50 transition-colors"
                        >
                          <i className="fas fa-minus text-[10px] text-gray-600"></i>
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-3 hover:bg-gray-50 transition-colors"
                        >
                          <i className="fas fa-plus text-[10px] text-gray-600"></i>
                        </button>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">Total: {formattedPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium">Sous-total</span>
              <span className="text-2xl font-bold text-gray-900">{formattedPrice(total)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-100 transform active:scale-[0.98]"
            >
              Passer la commande
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center">
              <i className="fas fa-lock mr-2"></i>
              Paiement 100% sécurisé via Mobile Money
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
