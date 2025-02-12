import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import { useTranslation } from "react-i18next";

type FormMode = 'login' | 'register';

const LoginPage: React.FC = () => {
  const { t } = useTranslation('login');
  const [mode, setMode] = useState<FormMode>('login');
  const [isChanging, setIsChanging] = useState(false);

  const handleModeChange = (newMode: FormMode) => {
    setIsChanging(true);
    setTimeout(() => {
      setMode(newMode);
      setIsChanging(false);
    }, 300);
  };

  return (
    <main className="flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 min-h-screen">
      <div className="max-w-md w-full mx-4 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className={`transform transition-all duration-300 ease-in-out ${
          isChanging ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}>
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {t(mode === 'login' ? 'login.title' : 'register.title')}
          </h1>
        </div>
        <LoginForm mode={mode} onModeChange={handleModeChange} />
      </div>
    </main>
  );
};

export default LoginPage;