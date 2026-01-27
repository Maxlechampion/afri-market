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
    { 
      id: 'super-1', 
      name: 'Directeur Général', 
      email: 'boss@afrimarket.com', 
      role: 'superadmin', 
      status: 'active', 
      joinedAt: new Date().toISOString() 
    },
    { 
      id: 'vendeur-1', 
      name: 'Électro Abidjan', 
      email: 'vendeur@test.com', 
      role: 'admin', 
      status: 'active', 
      joinedAt: new Date().toISOString() 
    }
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
    console.log("Login attempt with:", u);
    
    // Chercher l'utilisateur par email exact
    const existing = users.find(existingU => existingU.email.toLowerCase() === u.email.toLowerCase());
    
    console.log("Found existing user:", existing);
    
    let finalUser: User;
    if (existing) {
      // Si c'est un compte pré-défini, utiliser ses données complètes
      finalUser = { ...existing };
    } else {
      // Sinon créer un nouvel utilisateur avec le rôle 'user'
      finalUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: u.name,
        email: u.email,
        role: 'user',
        status: 'active',
        joinedAt: new Date().toISOString(),
      };
    }
    
    if (finalUser.status === 'blocked') {
      addToast("Votre compte est suspendu. Contactez le support.", "error");
      return;
    }

    console.log("User authenticated:", finalUser);
    setUser(finalUser);
    addToast(`Bienvenue, ${finalUser.name}! Rôle: ${finalUser.role}`, 'success');
  };

  const handleAiChat = async () => {
    if (!chatInput.trim() || isAiLoading) return;
    setIsAiLoading(true);
    const response = await getAIAssistance(chatInput, products);
    setAiResponse(response || "Désolé, je n'ai pas pu obtenir de réponse.");
    setChatInput('');
    setIsAiLoading(false);
  };

  // Debug: Log user state changes
  useEffect(() => {
    console.log("Current user:", user);
    console.log("Current view:", currentView);
  }, [user, currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar 
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        user={user}
        currentView={currentView}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => { 
          setUser(null); 
          setCurrentView('store'); 
          addToast("Déconnexion réussie"); 
        }}
        onSearch={setSearchTerm}
        onViewChange={setCurrentView}
      />

      <Toast messages={toasts} onRemove={removeToast} />

      {currentView === 'store' ? (
        <>
          {/* Hero Premium */}
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full animate-in fade-in duration-500">
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
            <div className="bg-white p-12 rounded-[50px] shadow-sm border border-gray-50 overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Historique d'Achats</h2>
                  <p className="text-gray-400 font-medium">Retrouvez toutes vos transactions passées</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-[32px] border border-orange-100 min-w-[200px]">
                  <p className="text-orange-600 font-black text-4xl mb-1">{orders.filter(o => o.customerId === user?.id).length}</p>
                  <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest">Colis reçus</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {orders.filter(o => o.customerId === user?.id).length > 0 ? (
                  orders.filter(o => o.customerId === user?.id).map(order => (
                    <div key={order.id} className="group p-8 border border-gray-100 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-8 hover:bg-gray-50 transition-all border-l-8 border-l-orange-500">
                      <div className="flex items-center gap-8 w-full md:w-auto">
                        <div className="w-16 h-16 bg-white rounded-[20px] flex items-center justify-center shadow-sm">
                          <i className="fas fa-truck text-orange-600 text-2xl"></i>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Commande #{order.id}</p>
                          <p className="font-black text-xl text-gray-900 tracking-tight">{new Date(order.date).toLocaleDateString()} • {order.items.length} articles</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                          <p className="text-2xl font-black text-gray-900 tracking-tight">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(order.total)}</p>
                          <span className={`inline-flex items-center gap-2 mt-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600 animate-pulse'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                            {order.status}
                          </span>
                        </div>
                        <button className="w-14 h-14 bg-white text-gray-400 hover:text-orange-600 hover:scale-110 transition-all rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm">
                          <i className="fas fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                    <p className="text-gray-400 font-black uppercase tracking-widest">Aucune commande pour le moment</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      )}

      {/* Assistant IA */}
      <div className="fixed bottom-10 right-10 z-[40]">
        <div className="relative group">
          <button 
            className="w-20 h-20 bg-gray-900 text-white rounded-[32px] flex items-center justify-center shadow-2xl hover:scale-110 transition-all active:scale-90 border-8 border-white group-hover:bg-orange-600 duration-500"
            onClick={() => setAiResponse(aiResponse ? null : "Besoin d'un guide pour vos achats ?")}
          >
            <i className="fas fa-sparkles text-2xl group-hover:rotate-45 transition-transform duration-500"></i>
          </button>
          
          {aiResponse && (
            <div className="absolute bottom-24 right-0 w-[400px] bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[600px] animate-in slide-in-from-bottom-8 duration-500">
              <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.5)]">
                    <i className="fas fa-robot text-sm"></i>
                  </div>
                  <div>
                    <span className="font-black text-xs uppercase tracking-widest block text-gray-400">Assistant</span>
                    <span className="font-black text-sm tracking-tight">AfriIntelligence</span>
                  </div>
                </div>
                <button onClick={() => setAiResponse(null)} className="text-gray-500 hover:text-white transition-colors">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <div className="p-10 overflow-y-auto flex-1 text-sm text-gray-600 leading-relaxed font-medium bg-gray-50/50">
                {aiResponse}
              </div>
              <div className="p-8 bg-white flex gap-4 border-t border-gray-50">
                <input 
                  type="text" 
                  className="flex-1 bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-orange-100 transition-all shadow-inner"
                  placeholder="Posez votre question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiChat()}
                />
                <button 
                  onClick={handleAiChat}
                  disabled={isAiLoading}
                  className="bg-gray-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-orange-600 disabled:opacity-50 transition-all shadow-xl"
                >
                  {isAiLoading ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-location-arrow"></i>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-32 px-4 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
            <div className="col-span-2 space-y-8">
              <h1 className="text-4xl font-black text-orange-500 tracking-tighter">AfriMarket</h1>
              <p className="text-gray-500 text-lg leading-relaxed max-w-sm">
                La plateforme panafricaine redéfinie. Technologie, sécurité et impact local.
              </p>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all cursor-pointer"><i className="fab fa-facebook-f text-sm"></i></div>
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all cursor-pointer"><i className="fab fa-instagram text-sm"></i></div>
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all cursor-pointer"><i className="fab fa-linkedin-in text-sm"></i></div>
              </div>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-gray-300">Marketplace</h4>
              <ul className="space-y-6 text-sm text-gray-500 font-bold">
                <li className="hover:text-orange-500 transition-colors cursor-pointer">Boutique Globale</li>
                <li className="hover:text-orange-500 transition-colors cursor-pointer">Devenir Partenaire</li>
                <li className="hover:text-orange-500 transition-colors cursor-pointer">Centre d'Aide</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-gray-300">Écosystème</h4>
              <ul className="space-y-6 text-sm text-gray-500 font-bold">
                <li className="hover:text-orange-500 transition-colors cursor-pointer">API Développeur</li>
                <li className="hover:text-orange-500 transition-colors cursor-pointer">FedaPay Connect</li>
                <li className="hover:text-orange-500 transition-colors cursor-pointer">Sécurité</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">© 2024 AfriMarket Intelligence. Technologie FedaPay.</p>
            <div className="flex gap-12 text-gray-600 text-[10px] font-black uppercase tracking-widest">
              <span className="hover:text-white cursor-pointer transition-colors">Politique</span>
              <span className="hover:text-white cursor-pointer transition-colors">Conditions</span>
              <span className="hover:text-white cursor-pointer transition-colors">Cookies</span>
            </div>
          </div>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        items={cart} 
        onClose={() => setIsCartOpen(false)}
        onRemove={(id) => {
          const item = cart.find(i => i.id === id);
          setCart(prev => prev.filter(i => i.id !== id));
          if (item) addToast(`${item.name} retiré`, "info");
        }}
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