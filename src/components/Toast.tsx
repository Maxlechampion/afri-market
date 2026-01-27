import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ messages, onRemove }) => {
  return (
    <div className="fixed top-24 right-6 z-50 space-y-4">
      {messages.map(message => (
        <div
          key={message.id}
          className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-lg border animate-in slide-in-from-top-4 duration-500 ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-900'
              : message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <i
            className={`fas text-lg ${
              message.type === 'success'
                ? 'fa-check-circle text-green-600'
                : message.type === 'error'
                ? 'fa-exclamation-circle text-red-600'
                : 'fa-info-circle text-blue-600'
            }`}
          ></i>
          <span className="font-bold text-sm">{message.text}</span>
          <button
            onClick={() => onRemove(message.id)}
            className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;