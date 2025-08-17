// src/LoginPage.tsx

import React from 'react';
import { supabase } from './supabaseClient';
import { Button, GoogleIcon } from './components';


interface LoginPageProps {
  onGuestLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onGuestLogin }) => {

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg text-center">
        
        <div className="flex items-center justify-center">
          <img src="https://i.postimg.cc/hvKj0ww3/bunk.png" alt="MessMate Logo" className="h-16 w-16" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome to MessMate
        </h1>
        
        <p className="text-slate-600">
          Log in with Google or continue as a guest to explore the app.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center py-3"
          >
            <GoogleIcon className="w-5 h-5 mr-3" />
            Sign In with Google
          </Button>

          {/* New Guest Mode Button */}
          <button
            onClick={onGuestLogin}
            className="w-full py-3 px-4 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
          >
            Continue as Guest
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;