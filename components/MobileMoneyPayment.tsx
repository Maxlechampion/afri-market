
import React, { useState, useEffect } from 'react';
import { Country, User } from '../types';
import { COUNTRIES } from '../constants';

interface MobileMoneyPaymentProps {
  total: number;
  user: User | null;
  import React, { useState } from 'react';
  import { Country, User } from '../types';
  import { COUNTRIES } from '../constants';
  
  interface MobileMoneyPaymentProps {
    total: number;
    user: User | null;
    onSuccess: () => void;
    onCancel: () => void;
  }
  
  declare global {
    interface Window {
      FedaPay: any;
    }
  }
  
  const MobileMoneyPayment: React.FC<MobileMoneyPaymentProps> = ({ total, user, onSuccess, onCancel }) => {
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [isLoading, setIsLoading] = useState(false);
  
    const formattedTotal = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(total);
  
    const startFedaPay = () => {
      if (!selectedCountry || !user) return;
  
      setIsLoading(true);
  
      // Initialisation du widget FedaPay avec la clé fournie par l'utilisateur
      window.FedaPay.init({
        public_key: 'pk_live_TGdd161oGSS0FTJeS9FVsp8I',
        transaction: {
          amount: total,
          description: `Commande AfriMarket pour ${user.name}`,
        },
        customer: {
          firstname: user.name.split(' ')[0],
          lastname: user.name.split(' ')[1] || 'Client',
          email: user.email,
        },
        onComplete: (data: any) => {
          setIsLoading(false);
          // Robustesse : Vérification du statut réel de la transaction
          if (data && (data.status === 'approved' || data.status === 'successful')) {
            onSuccess();
          } else if (data && data.status === 'canceled') {
            // Annulation manuelle par l'utilisateur
          } else {
            alert("Le paiement n'a pas pu être validé. Veuillez réessayer.");
          }
        }
      });
  
      try {
        window.FedaPay.open();
      } catch (error) {
        console.error("FedaPay Widget Error:", error);
        setIsLoading(false);
        alert("Impossible de lancer le module de paiement FedaPay.");
      }
    };
  
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
          <div className="p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Paiement Sécurisé</h2>
              <button onClick={onCancel} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">
                <i className="fas fa-times"></i>
              </button>
            </div>
  
            <div className="mb-8 p-6 bg-orange-50 rounded-3xl border border-orange-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-orange-600 text-xs font-black uppercase tracking-widest">Total à régler</span>
                <span className="font-black text-orange-700 text-2xl">{formattedTotal}</span>
              </div>
              <p className="text-[10px] text-orange-400 font-bold italic">Services de paiement par FedaPay</p>
            </div>
  
            <div className="space-y-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Choisissez votre pays</p>
              <div className="grid grid-cols-1 gap-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCountry(c)}
                    className={`w-full flex items-center p-5 rounded-2xl border-2 transition-all ${
                      selectedCountry?.code === c.code 
                      ? 'border-orange-500 bg-orange-50 shadow-lg' 
                      : 'border-gray-50 hover:border-orange-100 bg-white'
                    }`}
                  >
                    <span className="text-3xl mr-4">{c.flag}</span>
                    <div className="text-left">
                      <div className="font-black text-gray-900 text-sm">{c.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Mobile Money disponible</div>
                    </div>
                    {selectedCountry?.code === c.code && (
                      <div className="ml-auto w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-sm">
                        <i className="fas fa-check text-white text-[10px]"></i>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
  
            <div className="mt-10 space-y-4">
              <button
                onClick={startFedaPay}
                disabled={!selectedCountry || isLoading}
                className="w-full bg-orange-600 disabled:opacity-50 hover:bg-orange-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3 active:scale-95"
              >
                {isLoading ? (
                  <i className="fas fa-spinner animate-spin text-xl"></i>
                ) : (
                  <>
                    <i className="fas fa-shield-check text-lg"></i>
                    Payer avec Mobile Money
                  </>
                )}
              </button>
              <button
                onClick={onCancel}
                className="w-full py-2 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Annuler
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
               <i className="fab fa-cc-visa text-xl"></i>
               <i className="fab fa-cc-mastercard text-xl"></i>
               <span className="text-[10px] font-black">ORANGE</span>
               <span className="text-[10px] font-black">MTN</span>
               <span className="text-[10px] font-black">WAVE</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default MobileMoneyPayment;
  
  onSuccess: () => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    FedaPay: any;
  }
}

const MobileMoneyPayment: React.FC<MobileMoneyPaymentProps> = ({ total, user, onSuccess, onCancel }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formattedTotal = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0
  }).format(total);

  const startFedaPay = () => {
    if (!selectedCountry || !user) return;

    setIsLoading(true);

    // Initialisation du widget FedaPay
    // Note: Dans un environnement réel, la clé publique doit être dans process.env.FEDAPAY_PUBLIC_KEY
    window.FedaPay.init({
      public_key: 'pk_live_TGdd161oGSS0FTJeS9FVsp8I', // REMPLACER PAR VOTRE CLÉ PUBLIQUE SANDBOX
      transaction: {
        amount: total,
        description: `Commande AfriMarket pour ${user.name}`,
        callback_url: window.location.href, // URL de retour après paiement
      },
      customer: {
        firstname: user.name.split(' ')[0],
        lastname: user.name.split(' ')[1] || 'Client',
        email: user.email,
      }
    });

    // Ouvrir le widget
    window.FedaPay.open();
    
    // Pour la démo, on simule le succès après ouverture car FedaPay gère le reste dans sa popup
    // Dans une app réelle, le succès est confirmé par le Webhook backend
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Paiement Sécurisé FedaPay</h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-orange-600 font-medium">Montant à régler</span>
              <span className="font-bold text-orange-700 text-lg">{formattedTotal}</span>
            </div>
            <p className="text-[10px] text-orange-400 italic">Inclut les frais de transaction Mobile Money</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 font-bold mb-2">1. Choisissez votre pays</p>
            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCountry(c)}
                  className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${
                    selectedCountry?.code === c.code ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-orange-200'
                  }`}
                >
                  <span className="text-2xl mr-4">{c.flag}</span>
                  <div className="text-left">
                    <div className="font-bold text-gray-900">{c.name}</div>
                    <div className="text-xs text-gray-500">Paiement local via {c.operators[0]}...</div>
                  </div>
                  {selectedCountry?.code === c.code && <i className="fas fa-check-circle text-orange-600 ml-auto"></i>}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={startFedaPay}
              disabled={!selectedCountry || isLoading}
              className="w-full bg-orange-600 disabled:opacity-50 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <i className="fas fa-spinner animate-spin"></i>
              ) : (
                <>
                  <i className="fas fa-shield-alt"></i>
                  Payer avec FedaPay
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              className="w-full py-2 text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
            >
              Annuler et revenir au panier
            </button>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale">
            <span className="text-[10px] font-bold">ORANGE</span>
            <span className="text-[10px] font-bold">MTN</span>
            <span className="text-[10px] font-bold">MOOV</span>
            <span className="text-[10px] font-bold">WAVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMoneyPayment;
