import React, { useState } from 'react';
import { Product, Order, OrderStatus } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    rating: '4.5',
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image,
      rating: parseFloat(formData.rating),
      sellerId: 'admin',
      isVerified: true,
    };
    onAddProduct(product);
    setFormData({ name: '', description: '', price: '', category: '', image: '', rating: '4.5' });
    setShowAddForm(false);
  };

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;

  return (
    <div className="space-y-12">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-bold mb-2">Ventes Totales</p>
          <p className="text-4xl font-black text-gray-900">
            {new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'XOF',
              minimumFractionDigits: 0
            }).format(totalSales)}
          </p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-bold mb-2">Commandes</p>
          <p className="text-4xl font-black text-gray-900">{totalOrders}</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-bold mb-2">Produits</p>
          <p className="text-4xl font-black text-gray-900">{products.length}</p>
        </div>
      </div>

      {/* Add Product Button/Form */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-orange-600 transition-all"
        >
          <i className="fas fa-plus mr-2"></i>
          Ajouter un Produit
        </button>
      )}

      {showAddForm && (
        <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm">
          <h3 className="text-2xl font-black mb-8">Ajouter un Produit</h3>
          <form onSubmit={handleAddProduct} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Nom du produit"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="col-span-2 px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="col-span-2 px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
              <input
                type="number"
                placeholder="Prix (XOF)"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
              <input
                type="text"
                placeholder="Catégorie"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
              <input
                type="text"
                placeholder="URL Image"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="col-span-2 px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-orange-600 transition-all"
              >
                Publier le Produit
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-4 bg-gray-100 text-gray-900 font-black rounded-2xl hover:bg-gray-200 transition-all"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm">
        <h3 className="text-2xl font-black mb-8">Mes Produits</h3>
        {products.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Aucun produit pour le moment</p>
        ) : (
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors">
                <div className="flex items-center gap-6 flex-1">
                  <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-black text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.category} • {product.price} XOF</p>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className="px-6 py-2 bg-red-100 text-red-600 font-black rounded-lg hover:bg-red-200 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm">
        <h3 className="text-2xl font-black mb-8">Commandes</h3>
        {orders.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Aucune commande pour le moment</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <h4 className="font-black text-gray-900">Commande #{order.id}</h4>
                  <p className="text-sm text-gray-500">{order.items.length} articles • {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'XOF',
                    minimumFractionDigits: 0
                  }).format(order.total)}</p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-bold text-sm outline-none"
                >
                  <option value="pending">En attente</option>
                  <option value="shipped">Expédié</option>
                  <option value="delivered">Livré</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;