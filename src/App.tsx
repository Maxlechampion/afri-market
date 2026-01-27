import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import MobileMoneyPayment from './components/MobileMoneyPayment';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import Toast from './components/Toast';
import { MOCK_PRODUCTS, CATEGORIES } from './constants';
import { Product, CartItem, User, Order, ToastMessage, OrderStatus } from './types';
import { getAIAssistance } from './services/geminiService';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    { id: 'super-1', name: 'Directeur Général', email: 'boss@afrimarket.com', role: 'superadmin', status: 'active', joinedAt: new Date().toISOString() },
    { id: 'vendeur-1', name: 'Électro Abidjan', email: 'vendeur@test.com', role: 'admin', status: 'active', joinedAt: new Date().toISOString() }
  ]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [currentView, setCurrentView] = useState<'store' | 'dashboard'>('store');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // Toast Management
  const addToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => removeToast(id), 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Product Filtering
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'Tous' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory]);

  const sellerProducts = useMemo(() => {
    if (user?.role === 'superadmin') return products;
    if (user?.role === 'admin') return products.filter(p => p.sellerId === user.id);
    return [];
  }, [products, user]);

  // Cart Actions
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    addToast(`${product.name} ajouté au panier`);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    addToast(`Statut commande mis à jour : ${status}`, 'info');
  };

  const handleCheckout = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'pending',
      date: new Date().toISOString(),
      customerName: user?.name || 'Anonyme',
      customerId: user?.id || 'anon'
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsPaymentOpen(false);
    setIsCartOpen(false);
    addToast("Paiement Mobile Money réussi !", "success");
  };

  const handleAddProduct = (p: Product) => {
    const pWithSeller = { ...p, sellerId: user?.id || 'admin', isVerified: true };
    setProducts(prev => [pWithSeller, ...prev]);
    addToast("Produit mis en ligne avec succès");
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
      addToast("Produit supprimé", "info");
    }
  };

  const handleLogin = (u: User) => {
    const existing = users.find(existingU => existingU.email === u.email);
    const finalUser = existing ? { ...existing, ...u } : u;
    
    if (finalUser.status === 'blocked') {
      addToast("Votre compte est suspendu. Contactez le support.", "error");
      return;
    }

    setUser(finalUser);
    addToast(`Bienvenue, ${finalUser.name}`);
  };

  const handleAiChat = async () => {
    if (!chatInput.trim() || isAiLoading) return;
    setIsAiLoading(true);
    const response = await getAIAssistance(chatInput, products);
    setAiResponse(response || "Désolé, je n'ai pas pu obtenir de réponse.");
    setChatInput('');
    setIsAiLoading(false);
  };

  // Render Main App
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar 
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        user={user}
        currentView={currentView}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => { setUser(null); setCurrentView('store'); addToast("Déconnexion réussie"); }}
        onSearch={setSearchTerm}
        onViewChange={setCurrentView}
      />

      <Toast messages={toasts} onRemove={removeToast} />

      {currentView === 'store' ? (
        <>
          {/* Hero Section */}
          <div className="relative bg-gray-900 overflow-hidden py-32 px-4 shadow-2xl">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600 rounded-full blur-[200px] animate-pulse"></div>
            </div>
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full mb-8 animate-in slide-in-from-top-4 duration-700">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Nouvelle Collection 2024</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
                L'Afrique <br/><span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Connectée.</span>
              </h2>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed mb-12">
                Découvrez une sélection exclusive de produits livrés partout en Afrique. Sécurisé, rapide et propulsé par Mobile Money.
              </p>
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-16">
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-gray-900 tracking-tighter">Sélection du Jour</h3>
                <div className="w-20 h-2 bg-orange-600 rounded-full"></div>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {['Tous', ...CATEGORIES].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-8 py-3 rounded-[20px] text-xs font-black transition-all border whitespace-nowrap ${
                      activeCategory === cat 
                      ? 'bg-gray-900 text-white border-gray-900 shadow-xl' 
                      : 'bg-white text-gray-400 border-gray-100 hover:border-orange-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-40 bg-gray-50 rounded-[60px] border-2 border-dashed border-gray-200">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <i className="fas fa-search-minus text-gray-100 text-5xl"></i>
                </div>
                <h3 className="text-3xl font-black text-gray-300">Aucun résultat</h3>
                <p className="text-gray-400 mt-2 font-medium">Réessayez avec d'autres mots-clés ou filtres.</p>
              </div>
            )}
          </main>
        </>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
          {user?.role === 'superadmin' ? (
            <SuperAdminDashboard 
              users={users}
              products={products}
              orders={orders}
              onUpdateUser={(id, up) => {
                setUsers(prev => prev.map(u => u.id === id ? { ...u, ...up } : u));
                addToast("Utilisateur mis à jour", "info");
              }}
              onDeleteUser={(id) => {
                if (window.confirm("Supprimer cet utilisateur ?")) {
                  setUsers(prev => prev.filter(u => u.id !== id));
                  addToast("Utilisateur retiré", "error");
                }
              }}
              onDeleteProduct={handleDeleteProduct}
            />
          ) : user?.role === 'admin' ? (
            <AdminDashboard 
              products={sellerProducts}
              orders={orders.filter(o => o.items.some(i => i.sellerId === user.id))}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          ) : (
            <div className="bg-white p-12 rounded-[50px] shadow-sm border border-gray-50">
              <h2 className="text-4xl font-black text-gray-900 mb-8">Historique d'Achats</h2>
              {orders.filter(o => o.customerId === user?.id).length === 0 ? (
                <p className="text-center text-gray-400">Aucune commande</p>
              ) : (
                <div className="space-y-4">
                  {orders.filter(o => o.customerId === user?.id).map(order => (
                    <div key={order.id} className="p-4 border rounded-lg flex justify-between">
                      <span>Commande #{order.id}</span>
                      <span>{order.total} XOF</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* AI Assistant */}
      <div className="fixed bottom-10 right-10 z-[40]">
        <button 
          className="w-20 h-20 bg-gray-900 text-white rounded-[32px] flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
          onClick={() => setAiResponse(aiResponse ? null : "Besoin d'aide ?")}
        >
          <i className="fas fa-sparkles text-2xl"></i>
        </button>
        
        {aiResponse && (
          <div className="absolute bottom-24 right-0 w-[400px] bg-white rounded-[40px] shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black">Assistant IA</h3>
              <button onClick={() => setAiResponse(null)}>✕</button>
            </div>
            <p className="text-sm text-gray-600 mb-6">{aiResponse}</p>
            <div className="flex gap-4">
              <input 
                type="text" 
                className="flex-1 bg-gray-50 border rounded-lg px-4 py-2 text-xs outline-none"
                placeholder="Votre question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiChat()}
              />
              <button 
                onClick={handleAiChat}
                disabled={isAiLoading}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg"
              >
                {isAiLoading ? '...' : '→'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CartDrawer 
        isOpen={isCartOpen} 
        items={cart} 
        onClose={() => setIsCartOpen(false)}
        onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={handleLogin} 
      />

      {isPaymentOpen && (
        <MobileMoneyPayment 
          total={cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          user={user}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setIsPaymentOpen(false)}
        />
      )}
    </div>
  );
};

export default App;