
import React, { useEffect, useState } from 'react';
import { Toast as ToastType } from '../types';

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // Animate in
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300); // Wait for fade out
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons = {
    success: 'fa-solid fa-check-circle',
    error: 'fa-solid fa-times-circle',
    info: 'fa-solid fa-info-circle',
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div
      className={`flex items-center p-4 mb-4 text-white rounded-lg shadow-lg transition-all duration-300 transform ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${colors[toast.type]}`}
      role="alert"
    >
      <i className={`${icons[toast.type]} text-xl`}></i>
      <div className="ml-3 text-sm font-medium">{toast.message}</div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg hover:bg-white/20 inline-flex h-8 w-8"
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <i className="fa-solid fa-times"></i>
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-xs">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};
