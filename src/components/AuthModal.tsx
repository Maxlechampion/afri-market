import React, { useState } from 'react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: 'user',
      status: 'active',
      joinedAt: new Date().toISOString(),
    };

    onLogin(user);
    setEmail('');
    setName('');
    setIsSignUp(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-12 animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              {isSignUp ? 'Créer un compte' : 'Connexion'}
            </h2>
            <p className="text-gray-500">AfriMarket - Marketplace Africaine</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-2">
                Nom Complet
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean Dupont"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-orange-600 transition-all"
            >
              {isSignUp ? 'Créer mon compte' : 'Se connecter'}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              {isSignUp ? 'Déjà inscrit ?' : 'Nouveau client ?'}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2 text-orange-600 font-black hover:underline"
              >
                {isSignUp ? 'Se connecter' : "S'inscrire"}
              </button>
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthModal;