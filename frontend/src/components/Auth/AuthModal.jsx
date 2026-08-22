import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import Login from '../../pages/Login';
import SignUp from '../../pages/SignUp';

const AuthModal = ({ isOpen, onClose, onSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-fadeIn">
      {/* Click backdrop overlay to dismiss modal */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card Container */}
      <div className="relative z-10 w-full max-w-[370px] max-h-[92vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-1 text-white scrollbar-thin scrollbar-thumb-zinc-700">
        
        {/* Top Control Bar with Close (X) button */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1 border-b border-zinc-800/80">
          <span className="text-xs font-bold text-yellow-400 tracking-wider uppercase">
            {mode === 'login' ? 'Sign In to Continue' : 'Create Account'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none"
            title="Close"
            aria-label="Close auth modal"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {/* Form Body - Reusing Login or SignUp */}
        <div className="p-2">
          {mode === 'login' ? (
            <Login
              isModal={true}
              onSuccess={(data) => {
                if (onSuccess) onSuccess(data);
                onClose();
              }}
              onSwitchToSignUp={() => setMode('signup')}
            />
          ) : (
            <SignUp
              isModal={true}
              onSuccess={(data) => {
                if (onSuccess) onSuccess(data);
                onClose();
              }}
              onSwitchToLogin={() => setMode('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
