
import React, { useState, useMemo } from 'react';
import { Product, Order, Stats, OrderStatus } from '../types';
import { CATEGORIES } from '../constants';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, orders, onAddProduct, onDeleteProduct, onUpdateOrderStatus 
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders'>('stats');
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category: CATEGORIES[0],
    description: '',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600'
  });

  const stats: Stats = useMemo(() => ({
    totalSales: orders.reduce((sum, o) => sum + o.total, 0),
    orderCount: orders.length,
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length : 0,
    categoryDistribution: products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  }), [products, orders]);

  const formatPrice = (p: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(p);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.price <= 0 || !newProduct.name.trim()) return;

    setIsSubmitting(true);
    // Simulation délai réseau pour UX
    await new Promise(r => setTimeout(r, 800));
    
    onAddProduct({
      ...newProduct,
      id: Math.random().toString(36).substr(2, 9),
      rating: 5.0,
      sellerId: 'current' // Sera géré par App.tsx
    });
    
    setIsSubmitting(false);
    setIsAdding(false);
    setNewProduct({ name: '', price: 0, category: CATEGORIES[0], description: '', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600' });
  };

  return (
    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8 bg-gray-50/50 border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Business Studio</h2>
            <p className="text-gray-400 text-sm">Gérez votre boutique en toute simplicité</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-[24px] shadow-inner border border-gray-100">
            {[
              { id: 'stats', label: 'Dashboard', icon: 'fa-chart-pie' },
              { id: 'products', label: 'Mes Produits', icon: 'fa-box-open' },
              { id: 'orders', label: 'Ventes', icon: 'fa-shopping-bag' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-[20px] text-xs font-black transition-all flex items-center gap-2 ${
                  activeTab === tab.id ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <i className={`fas ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'stats' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[32px] text-white shadow-xl shadow-orange-100">
                <p className="text-orange-100 text-[10px] font-black uppercase tracking-widest mb-2">Chiffre d'Affaires</p>
                <p className="text-4xl font-black">{formatPrice(stats.totalSales)}</p>
              </div>
              <div className="p-8 bg-white border-2 border-gray-50 rounded-[32px]">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Commandes Reçues</p>
                <p className="text-4xl font-black text-gray-900">{stats.orderCount}</p>
              </div>
              <div className="p-8 bg-white border-2 border-gray-50 rounded-[32px]">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Articles en Ligne</p>
                <p className="text-4xl font-black text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900">Mon Inventaire</h3>
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all flex items-center gap-2"
              >
                <i className="fas fa-plus"></i> Ajouter un article
              </button>
            </div>

            {isAdding && (
              <div className="bg-gray-50 p-8 rounded-[32px] border-2 border-dashed border-gray-200 animate-in fade-in zoom-in duration-300">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nom du produit</label>
                    <input 
                      className="w-full p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-orange-100 transition-all font-bold"
                      value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Prix (XOF)</label>
                    <input 
                      type="number"
                      className="w-full p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-orange-100 transition-all font-bold"
                      value={newProduct.price || ''}
                      onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Description complète</label>
                    <textarea 
                      className="w-full p-4 rounded-2xl border-none outline-none focus:ring-4 focus:ring-orange-100 transition-all font-bold"
                      rows={3}
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-4 md:col-span-2">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 bg-orange-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-orange-100 hover:bg-orange-700 disabled:opacity-50"
                    >
                      {isSubmitting ? <i className="fas fa-spinner animate-spin"></i> : "Publier l'article"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsAdding(false)} 
                      className="px-8 py-5 rounded-2xl font-black text-gray-400 hover:bg-gray-100"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {products.map(p => (
                <div key={p.id} className="group flex items-center gap-6 p-6 bg-white border border-gray-100 rounded-[24px] hover:shadow-xl hover:border-transparent transition-all">
                  <img src={p.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                  <div className="flex-1">
                    <p className="font-black text-gray-900 text-lg tracking-tight">{p.name}</p>
                    <p className="text-xs text-orange-600 font-black uppercase tracking-widest">{p.category} • {formatPrice(p.price)}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="w-12 h-12 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      onClick={() => onDeleteProduct(p.id)}
                      className="w-12 h-12 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <i className="far fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900">Suivi des Ventes</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                    <th className="pb-4">Client / Date</th>
                    <th className="pb-4">Statut</th>
                    <th className="pb-4">Total</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-6">
                        <p className="font-black text-gray-900 tracking-tight">{o.customerName}</p>
                        <p className="text-[10px] text-gray-400">{new Date(o.date).toLocaleDateString()}</p>
                      </td>
                      <td className="py-6">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          o.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          o.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-6 font-black text-gray-900">{formatPrice(o.total)}</td>
                      <td className="py-6 text-right">
                        <select 
                          className="text-xs font-bold border-none bg-gray-100 rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
                          value={o.status}
                          onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                        >
                          <option value="pending">En attente</option>
                          <option value="shipped">Expédié</option>
                          <option value="delivered">Livré</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <p className="text-center py-12 text-gray-400 font-medium italic">Aucune vente enregistrée pour le moment.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
