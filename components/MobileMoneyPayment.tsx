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

    // Initialisation du widget FedaPay avec la clé publique
    window.FedaPay.init({
      public_key: process.env.FEDAPAY_PUBLIC_KEY || 'pk_live_TGdd161oGSS0FTJeS9FVsp8I',
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
        if (data && (data.status === 'approved' || data.status === 'successful')) {
          onSuccess();
        } else if (data && data.status === 'canceled') {
          // Annulation par l'utilisateur
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