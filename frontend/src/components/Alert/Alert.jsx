import React, { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Premium Alert Component with Smooth Outro
 * File: components/Alert/Alert.jsx
 */

const Alert = ({ 
  type = 'info', 
  title = '', 
  message = '', 
  onClose,
  autoClose = true,
  duration = 5000,
  position = 'top-right',
  showIcon = true,
  showCloseButton = true
}) => {
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 400);
  };

  const alertConfig = {
    success: {
      icon: CheckCircle,
      bgLight: 'bg-emerald-50',
      bgDark: 'dark:bg-emerald-950/30',
      borderLight: 'border-emerald-200',
      borderDark: 'dark:border-emerald-800/50',
      iconBgLight: 'bg-emerald-100',
      iconBgDark: 'dark:bg-emerald-900/40',
      iconColorLight: 'text-emerald-600',
      iconColorDark: 'dark:text-emerald-400',
      titleColorLight: 'text-emerald-900',
      titleColorDark: 'dark:text-emerald-100',
      textColorLight: 'text-emerald-700',
      textColorDark: 'dark:text-emerald-300',
      progressBg: 'bg-emerald-500',
      shadow: 'shadow-xl shadow-emerald-500/20',
      gradient: 'bg-gradient-to-r from-emerald-500 to-green-500'
    },
    error: {
      icon: XCircle,
      bgLight: 'bg-red-50',
      bgDark: 'dark:bg-red-950/30',
      borderLight: 'border-red-200',
      borderDark: 'dark:border-red-800/50',
      iconBgLight: 'bg-red-100',
      iconBgDark: 'dark:bg-red-900/40',
      iconColorLight: 'text-red-600',
      iconColorDark: 'dark:text-red-400',
      titleColorLight: 'text-red-900',
      titleColorDark: 'dark:text-red-100',
      textColorLight: 'text-red-700',
      textColorDark: 'dark:text-red-300',
      progressBg: 'bg-red-500',
      shadow: 'shadow-xl shadow-red-500/20',
      gradient: 'bg-gradient-to-r from-red-500 to-rose-500'
    },
    warning: {
      icon: AlertTriangle,
      bgLight: 'bg-amber-50',
      bgDark: 'dark:bg-amber-950/30',
      borderLight: 'border-amber-200',
      borderDark: 'dark:border-amber-800/50',
      iconBgLight: 'bg-amber-100',
      iconBgDark: 'dark:bg-amber-900/40',
      iconColorLight: 'text-amber-600',
      iconColorDark: 'dark:text-amber-400',
      titleColorLight: 'text-amber-900',
      titleColorDark: 'dark:text-amber-100',
      textColorLight: 'text-amber-700',
      textColorDark: 'dark:text-amber-300',
      progressBg: 'bg-amber-500',
      shadow: 'shadow-xl shadow-amber-500/20',
      gradient: 'bg-gradient-to-r from-amber-500 to-yellow-500'
    },
    info: {
      icon: Info,
      bgLight: 'bg-blue-50',
      bgDark: 'dark:bg-blue-950/30',
      borderLight: 'border-blue-200',
      borderDark: 'dark:border-blue-800/50',
      iconBgLight: 'bg-blue-100',
      iconBgDark: 'dark:bg-blue-900/40',
      iconColorLight: 'text-blue-600',
      iconColorDark: 'dark:text-blue-400',
      titleColorLight: 'text-blue-900',
      titleColorDark: 'dark:text-blue-100',
      textColorLight: 'text-blue-700',
      textColorDark: 'dark:text-blue-300',
      progressBg: 'bg-blue-500',
      shadow: 'shadow-xl shadow-blue-500/20',
      gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    }
  };

  const positionClasses = {
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'top-center': 'top-6 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2'
  };

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(120%) scale(0.9);
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-slideOut {
          animation: slideOut 0.4s cubic-bezier(0.7, 0, 0.84, 0) forwards;
        }

        .animate-shrink {
          animation: shrink linear forwards;
        }
      `}</style>

      <div 
        className={`fixed ${positionClasses[position]} z-[9999] pointer-events-auto ${
          isExiting ? 'animate-slideOut' : 'animate-slideIn'
        }`}
        style={{ minWidth: '350px', maxWidth: '450px' }}
      >
        <div 
          className={`
            relative
            ${config.bgLight} ${config.bgDark}
            ${config.borderLight} ${config.borderDark}
            border-2
            rounded-2xl
            ${config.shadow}
            overflow-hidden
            backdrop-blur-xl
            transition-all duration-300
          `}
        >
          {/* Gradient Top Border */}
          <div className={`h-1.5 ${config.gradient}`} />

          {/* Main Content */}
          <div className="p-5">
            <div className="flex items-start gap-4">
              {/* Icon */}
              {showIcon && (
                <div
                  className={`
                    flex-shrink-0 
                    ${config.iconBgLight} ${config.iconBgDark}
                    ${config.iconColorLight} ${config.iconColorDark}
                    w-12 h-12
                    rounded-xl
                    flex items-center justify-center
                    shadow-lg
                    transition-transform duration-300 hover:scale-110
                  `}
                >
                  <Icon size={24} strokeWidth={2.5} />
                </div>
              )}

              {/* Text Content */}
              <div className="flex-1 min-w-0 pt-1">
                {title && (
                  <h4 
                    className={`
                      font-bold 
                      text-lg 
                      ${config.titleColorLight} ${config.titleColorDark}
                      mb-1.5
                      leading-tight
                    `}
                  >
                    {title}
                  </h4>
                )}
                <p 
                  className={`
                    text-sm 
                    ${config.textColorLight} ${config.textColorDark}
                    leading-relaxed
                    font-medium
                  `}
                >
                  {message}
                </p>
              </div>

              {/* Close Button */}
              {showCloseButton && onClose && (
                <button
                  onClick={handleClose}
                  className="
                    flex-shrink-0 
                    text-gray-400 
                    hover:text-gray-600
                    dark:text-gray-500
                    dark:hover:text-gray-300
                    transition-all duration-200
                    p-1.5
                    rounded-lg
                    hover:bg-black/5
                    dark:hover:bg-white/5
                    hover:scale-110
                  "
                  aria-label="Close alert"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {autoClose && !isExiting && (
            <div className="h-1 bg-black/5 dark:bg-white/5">
              <div 
                className={`h-full ${config.progressBg} animate-shrink`}
                style={{ animationDuration: `${duration}ms` }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Alert;