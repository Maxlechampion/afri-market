import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
          <i className="fas fa-star text-orange-500 text-sm"></i>
          <span className="font-black text-sm text-gray-900">{product.rating}</span>
        </div>
        {product.isVerified && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
            ✓ Vérifié
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-black uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-2xl font-black text-gray-900">
            {new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'XOF',
              minimumFractionDigits: 0
            }).format(product.price)}
          </span>
        </div>

        {/* Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2 group/btn"
        >
          <i className="fas fa-shopping-cart group-hover/btn:scale-110 transition-transform"></i>
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default ProductCard;