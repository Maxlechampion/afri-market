
import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ messages, onRemove }) => {
  return (
    <div className="fixed top-20 right-6 z-[110] flex flex-col gap-3 pointer-events-none">
      {messages.map((m) => (
        <div 
          key={m.id}
          className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-8 duration-300 ${
            m.type === 'success' ? 'bg-green-600 border-green-500 text-white' : 
            m.type === 'error' ? 'bg-red-600 border-red-500 text-white' : 
            'bg-gray-900 border-gray-800 text-white'
          }`}
        >
          <i className={`fas ${m.type === 'success' ? 'fa-check-circle' : m.type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
          <span className="font-bold text-sm">{m.text}</span>
          <button onClick={() => onRemove(m.id)} className="ml-4 opacity-50 hover:opacity-100">
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
