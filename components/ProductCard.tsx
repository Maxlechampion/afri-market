
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0
  }).format(product.price);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-gray-700">
          <i className="fas fa-star text-yellow-400 mr-1"></i>
          {product.rating}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">
          {product.category}
        </span>
        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <span className="text-lg font-bold text-gray-900">{formattedPrice}</span>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
            title="Ajouter au panier"
          >
            <i className="fas fa-plus mr-2"></i>
            Panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
