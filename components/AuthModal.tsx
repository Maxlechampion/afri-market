
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logique de simulation pour la démo
    let finalRole: UserRole = selectedRole;
    if (isLogin && email === 'boss@afrimarket.com') finalRole = 'superadmin';
    if (isLogin && email === 'vendeur@test.com') finalRole = 'admin';

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: name || (finalRole === 'superadmin' ? 'Le Super Boss' : finalRole === 'admin' ? 'Ma Boutique' : 'Client VIP'),
      role: finalRole,
      status: 'active',
      joinedAt: new Date().toISOString()
    };
    onLogin(mockUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xl">
      <div className="bg-white rounded-[48px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-500 border border-gray-100">
        <div className="p-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter">{isLogin ? 'Connexion' : 'Créer un compte'}</h2>
              <p className="text-gray-400 text-sm mt-1">Accédez à l'expérience multi-marketplace</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Nom / Enseigne</label>
                <input
                  type="text"
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[24px] focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all font-bold text-gray-900"
                  placeholder="Ex: Boutique Abidjan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Email Professionnel</label>
              <input
                type="email"
                required
                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[24px] focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all font-bold text-gray-900"
                placeholder="nom@domaine.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {!isLogin && (
              <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Choisir mon profil</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setSelectedRole('user')}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedRole === 'user' ? 'border-orange-500 bg-white shadow-lg' : 'border-transparent text-gray-400 hover:bg-white'}`}
                  >
                    <i className="fas fa-shopping-bag"></i>
                    <span className="text-[10px] font-black uppercase">Client</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedRole === 'admin' ? 'border-orange-500 bg-white shadow-lg' : 'border-transparent text-gray-400 hover:bg-white'}`}
                  >
                    <i className="fas fa-store"></i>
                    <span className="text-[10px] font-black uppercase">Vendeur</span>
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-6 rounded-[24px] transition-all shadow-2xl shadow-orange-200 mt-4 active:scale-95 text-lg tracking-tight"
            >
              {isLogin ? 'Ouvrir ma session' : 'Finaliser mon inscription'}
            </button>
          </form>

          <div className="mt-12 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-400 text-sm font-bold hover:text-orange-600 transition-colors"
            >
              {isLogin ? "Vous n'avez pas encore de compte ?" : "Déjà membre de la communauté ?"} <span className="text-orange-600 ml-1 underline underline-offset-4">Cliquez ici</span>
            </button>
          </div>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
             <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-[10px] font-bold text-gray-400 leading-tight">
               💡 Pour tester le <span className="text-orange-600 uppercase">SuperAdmin</span>, utilisez l'email : <br/><span className="text-gray-900">boss@afrimarket.com</span>
             </div>
             <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-[10px] font-bold text-gray-400 leading-tight">
               💡 Pour tester un <span className="text-blue-600 uppercase">Vendeur</span>, utilisez l'email : <br/><span className="text-gray-900">vendeur@test.com</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
