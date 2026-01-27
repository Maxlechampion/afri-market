import React, { useState } from 'react';
import { User, PaymentMethod } from '../types';
import { COUNTRIES } from '../constants';

interface MobileMoneyPaymentProps {
  total: number;
  user: User | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const MobileMoneyPayment: React.FC<MobileMoneyPaymentProps> = ({
  total,
  user,
  onSuccess,
  onCancel,
}) => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const availableMethods = selectedCountry.operators;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMethod || !phone) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setIsProcessing(true);

    // Simuler un appel API FedaPay
    setTimeout(() => {
      alert(`Paiement de ${total} XOF réussi via ${selectedMethod}!`);
      onSuccess();
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-12 animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Paiement</h2>
              <p className="text-gray-500 text-sm mt-1">Sécurisé par FedaPay</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <i className="fas fa-lock text-orange-600 text-lg"></i>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
            <p className="text-gray-600 text-sm font-bold mb-2">Montant à payer</p>
            <p className="text-4xl font-black text-gray-900">
              {new Intl.NumberFormat('fr-FR', { 
                style: 'currency', 
                currency: 'XOF',
                minimumFractionDigits: 0
              }).format(total)}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handlePayment} className="space-y-6">
            {/* Country Selection */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-2">
                Pays
              </label>
              <select
                value={selectedCountry.code}
                onChange={(e) => {
                  const country = COUNTRIES.find(c => c.code === e.target.value);
                  if (country) setSelectedCountry(country);
                  setSelectedMethod(null);
                }}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400"
              >
                {COUNTRIES.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-3">
                Opérateur Mobile Money
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableMethods.map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setSelectedMethod(method)}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                      selectedMethod === method
                        ? 'bg-orange-50 border-orange-500 text-orange-600'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-orange-200'
                    }`}
                  >
                    {method.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-2">
                Numéro de téléphone
              </label>
              <div className="flex">
                <span className="px-4 py-4 bg-gray-50 border border-gray-200 border-r-0 rounded-l-2xl text-gray-900 font-bold text-sm">
                  {selectedCountry.prefix}
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0123456789"
                  className="flex-1 px-6 py-4 bg-gray-50 border border-gray-200 rounded-r-2xl outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onCancel}
                disabled={isProcessing}
                className="flex-1 py-4 bg-gray-100 text-gray-900 font-black rounded-2xl hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isProcessing || !selectedMethod}
                className="flex-1 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner animate-spin"></i>
                    Traitement...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    Payer
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Badge */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <i className="fas fa-shield-alt text-green-600"></i>
              Paiement 100% sécurisé avec FedaPay
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMoneyPayment;