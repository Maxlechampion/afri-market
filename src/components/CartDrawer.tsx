import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onRemove,
  onUpdateQuantity,
  onCheckout,
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[45]"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[45] transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <h2 className="text-2xl font-black text-gray-900">Panier</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className="fas fa-times text-xl text-gray-900"></i>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <i className="fas fa-shopping-bag text-6xl text-gray-200 mb-4"></i>
              <p className="text-gray-500 font-bold">Votre panier est vide</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-black text-sm text-gray-900 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'XOF',
                      minimumFractionDigits: 0
                    }).format(item.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-6 h-6 bg-white rounded flex items-center justify-center text-sm font-bold border"
                    >
                      −
                    </button>
                    <span className="text-sm font-black w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 bg-white rounded flex items-center justify-center text-sm font-bold border"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="ml-auto text-xs text-red-600 hover:text-red-700 font-bold"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-8 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-bold">Total</span>
              <span className="text-3xl font-black text-gray-900">
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'XOF',
                  minimumFractionDigits: 0
                }).format(total)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-orange-600 transition-all"
            >
              Procéder au paiement
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;