import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 3000 
}) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => {
        setIsShowing(false);
        setTimeout(onClose, 300); // 애니메이션 완료 후 제거
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-50 max-w-sm w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-2xl transform transition-all duration-300";
    
    const typeStyles = {
      success: "border-green-400/50 text-green-100",
      error: "border-red-400/50 text-red-100", 
      warning: "border-yellow-400/50 text-yellow-100",
      info: "border-blue-400/50 text-blue-100"
    };

    const visibilityStyles = isShowing 
      ? "translate-x-0 opacity-100" 
      : "translate-x-full opacity-0";

    return `${baseStyles} ${typeStyles[type]} ${visibilityStyles}`;
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start space-x-3">
        <span className="text-lg flex-shrink-0">{getIcon()}</span>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsShowing(false);
            setTimeout(onClose, 300);
          }}
          className="text-gray-400 hover:text-white transition-colors duration-200 flex-shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast; 