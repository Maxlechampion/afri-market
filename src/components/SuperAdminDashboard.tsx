import React from 'react';
import { Product, Order, User } from '../types';

interface SuperAdminDashboardProps {
  users: User[];
  products: Product[];
  orders: Order[];
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
  onDeleteProduct: (id: string) => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  users,
  products,
  orders,
  onUpdateUser,
  onDeleteUser,
  onDeleteProduct,
}) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-12">
      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-bold mb-2">Revenu Total</p>
          <p className="text-3xl font-black text-gray-900">
            {new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'XOF',
              minimumFractionDigits: 0
            }).format(totalRevenue)}
          </p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-bold mb-2">Utilisateurs</p>
          <p className="text-3xl font-black text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-bold mb-2">Produits</p>
          <p className="text-3xl font-black text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-bold mb-2">Commandes</p>
          <p className="text-3xl font-black text-gray-900">{orders.length}</p>
        </div>
      </div>

      {/* Users Management */}
      <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm">
        <h3 className="text-2xl font-black mb-8">Gestion des Utilisateurs</h3>
        {users.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Aucun utilisateur</p>
        ) : (
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-orange-600"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {user.role}
                  </span>
                  <select
                    value={user.status}
                    onChange={(e) => onUpdateUser(user.id, { status: e.target.value as any })}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg font-bold text-xs outline-none"
                  >
                    <option value="active">Actif</option>
                    <option value="blocked">Bloqué</option>
                  </select>
                  <button
                    onClick={() => onDeleteUser(user.id)}
                    className="px-4 py-2 bg-red-100 text-red-600 font-black text-sm rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Products Management */}
      <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm">
        <h3 className="text-2xl font-black mb-8">Gestion des Produits</h3>
        {products.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Aucun produit</p>
        ) : (
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors">
                <div className="flex items-center gap-6 flex-1">
                  <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-black text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.category} • {product.price} XOF • Vendeur: {product.sellerId}</p>
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

      {/* Orders Summary */}
      <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm">
        <h3 className="text-2xl font-black mb-8">Résumé des Commandes</h3>
        {orders.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Aucune commande</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <h4 className="font-black text-gray-900">Commande #{order.id}</h4>
                  <p className="text-sm text-gray-500">
                    {order.customerName} • {order.items.length} articles
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <p className="font-black text-lg">
                    {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'XOF',
                      minimumFractionDigits: 0
                    }).format(order.total)}
                  </p>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;