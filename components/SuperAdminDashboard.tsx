
import React, { useState } from 'react';
import { Product, Order, User, Stats } from '../types';

interface SuperAdminDashboardProps {
  users: User[];
  products: Product[];
  orders: Order[];
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
  onDeleteProduct: (productId: string) => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ 
  users, products, orders, onUpdateUser, onDeleteUser, onDeleteProduct 
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'inventory' | 'global-stats'>('global-stats');

  const stats: Stats = {
    totalSales: orders.reduce((sum, o) => sum + o.total, 0),
    orderCount: orders.length,
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length : 0,
    categoryDistribution: {},
    userCount: users.length,
    activeSellers: users.filter(u => u.role === 'admin').length
  };

  const formatPrice = (p: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(p);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gray-900 p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Control Center <span className="text-orange-500">SuperAdmin</span></h2>
            <p className="text-gray-400 text-sm mt-1">Gestion globale de la Marketplace AfriMarket</p>
          </div>
          <div className="flex bg-white/10 p-1 rounded-2xl backdrop-blur-md">
            <button onClick={() => setActiveTab('global-stats')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'global-stats' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:text-white'}`}>Vue Globale</button>
            <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'users' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:text-white'}`}>Utilisateurs</button>
            <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'inventory' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:text-white'}`}>Inventaire</button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'global-stats' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Volume d'Affaires</p>
                <p className="text-2xl font-black text-gray-900">{formatPrice(stats.totalSales)}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Utilisateurs</p>
                <p className="text-2xl font-black text-gray-900">{stats.userCount}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Vendeurs</p>
                <p className="text-2xl font-black text-gray-900">{stats.activeSellers}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Commandes</p>
                <p className="text-2xl font-black text-gray-900">{stats.orderCount}</p>
              </div>
            </div>

            <div className="bg-orange-600 rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center shadow-2xl shadow-orange-200">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-1">Status de la plateforme : <span className="text-green-300">Opérationnel</span></h3>
                <p className="text-orange-100 text-sm">Toutes les transactions FedaPay sont traitées normalement.</p>
              </div>
              <button className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-transform">Rapport Détaillé</button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="overflow-x-auto animate-in slide-in-from-right-4 duration-300">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-widest border-b border-gray-100">
                  <th className="pb-4 font-black">Utilisateur</th>
                  <th className="pb-4 font-black">Rôle</th>
                  <th className="pb-4 font-black">Statut</th>
                  <th className="pb-4 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${
                        u.role === 'superadmin' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-bold ${u.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {u.status === 'active' ? 'Actif' : 'Bloqué'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onUpdateUser(u.id, { status: u.status === 'active' ? 'blocked' : 'active' })}
                          className={`p-2 rounded-xl transition-colors ${u.status === 'active' ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                          title={u.status === 'active' ? 'Bloquer' : 'Débloquer'}
                        >
                          <i className={`fas ${u.status === 'active' ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                        </button>
                        <button 
                          onClick={() => onDeleteUser(u.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Supprimer définitivement"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {products.map(p => (
                 <div key={p.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:shadow-md transition-all bg-gray-50/30">
                   <img src={p.image} className="w-16 h-16 rounded-xl object-cover" />
                   <div className="flex-1">
                     <p className="font-bold text-gray-900">{p.name}</p>
                     <p className="text-[10px] text-gray-400 uppercase font-black">Vendeur ID: {p.sellerId}</p>
                     <p className="text-orange-600 font-black text-sm">{formatPrice(p.price)}</p>
                   </div>
                   <button 
                    onClick={() => onDeleteProduct(p.id)}
                    className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-all"
                   >
                     <i className="fas fa-ban"></i>
                   </button>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
