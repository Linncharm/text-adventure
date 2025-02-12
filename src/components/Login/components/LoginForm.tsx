import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase"
import { toast } from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

type FormMode = 'login' | 'register';

interface LoginFormProps {
  mode: FormMode;
  onModeChange: (mode: FormMode) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ mode, onModeChange }) => {
  const { t } = useTranslation('login');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const isPasswordValid = (pass: string) => {
    if (pass.length < 6) return false;
    if (pass.length > 20) return false;
    if (!/[a-z]/.test(pass)) return false;
    if (!/[0-9]/.test(pass)) return false;
    return true;
  };

  const updatePasswordError = (pass: string) => {
    if (pass.length < 6) {
      setPasswordError(t('common.passwordTooShort'));
      return;
    }
    if (pass.length > 20) {
      setPasswordError(t('common.passwordTooLong'));
      return;
    }
    if (!/[a-z]/.test(pass)) {
      setPasswordError(t('common.passwordNeedsLowercase'));
      return;
    }
    if (!/[0-9]/.test(pass)) {
      setPasswordError(t('common.passwordNeedsNumber'));
      return;
    }
    setPasswordError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (mode === 'register') {
      updatePasswordError(newPassword);
    }
  };

  const handleSendVerificationCode = async () => {
    if (!email || countdown > 0) return;
    
    if (mode === 'register' && !isPasswordValid(password)) {
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      toast.success(t('login.codeSent'));
      
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      console.error('发送验证码失败:', error);
      toast.error(error.message || t('login.sendCodeError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      if (password.length < 6) {
        throw new Error(t('login.passwordTooShort'));
      }

      const { error } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: 'signup',
      });

      if (error) throw error;

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: (await supabase.auth.getUser()).data.user?.id,
            email,
            created_at: new Date().toISOString(),
          }
        ]);

      if (profileError) throw profileError;

      toast.success(t('login.registerSuccess'));
      router.push('/profile');
    } catch (error: any) {
      console.error('注册失败:', error);
      toast.error(error.message || t('login.registerError'));
    }
  };

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success(t('login.loginSuccess'));
      router.push('/profile');
    } catch (error: any) {
      console.error('登录失败:', error);
      toast.error(error.message || t('login.loginError'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'register' && !isPasswordValid(password)) {
      return;
    }
    
    setIsLoading(true);

    try {
      if (mode === 'register') {
        await handleRegister();
      } else {
        await handleLogin();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = () => {
    setIsChanging(true);
    setTimeout(() => {
      onModeChange(mode === 'login' ? 'register' : 'login');
      setIsChanging(false);
    }, 300);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('common.email')}
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t('common.emailPlaceholder')}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('common.password')}
        </label>
        <div className="relative mt-1">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
            placeholder={t('common.passwordPlaceholder')}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 bg-transparent border-none outline-none focus:outline-none"
          >
            {showPassword ? (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {passwordError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">
            {passwordError}
          </p>
        )}
      </div>

      <div
        className={`transform transition-all duration-300 ease-in-out overflow-hidden ${
          mode === 'register'
            ? 'opacity-100 translate-y-0 max-h-[200px] mb-6'
            : 'opacity-0 -translate-y-4 max-h-0 mb-0'
        }`}
      >
        <div className="flex items-center justify-between">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('common.code')}
          </label>
          <button
            type="button"
            onClick={handleSendVerificationCode}
            disabled={countdown > 0 || !email || (mode === 'register' && !isPasswordValid(password))}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:text-gray-400 dark:disabled:text-gray-500 border-none hover:bg-transparent"
          >
            {countdown > 0 
              ? t('register.countdown', { seconds: countdown }) 
              : t('register.sendCode')}
          </button>
        </div>
        <input
          type="text"
          id="code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t('common.codePlaceholder')}
          required={mode === 'register'}
        />
      </div>

      <div className={`transform transition-all duration-300 ease-in-out ${isChanging ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 hover:text-white"
        >
          {isLoading 
            ? t('common.loading')
            : (mode === 'login' ? t('login.login') : t('register.register'))}
        </button>
      </div>

      <div className={`text-center transform transition-all duration-300 ease-in-out ${isChanging ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <button
          type="button"
          onClick={handleModeChange}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border-none hover:bg-transparent"
        >
          {mode === 'login' ? t('register.toRegister') : t('login.toLogin')}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;