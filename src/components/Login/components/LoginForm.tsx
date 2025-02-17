import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { supabase } from "@/lib";
import { toast } from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { useLoading } from '@/context/LoadingContext';
import md5 from 'md5';
import { setCookie } from 'cookies-next';

type FormMode = 'login' | 'register';

interface LoginFormProps {
  mode: FormMode;
  onModeChange: (mode: FormMode) => void;
}


const LoginForm: React.FC<LoginFormProps> = ({ mode, onModeChange }) => {
  const client = supabase
  const { setLoading } = useLoading();
  const { t } = useTranslation('login');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const saveAuthToken = (session: any) => {
    if (!session) return;

    // 设置 token 到 cookie 中
    setCookie('token', session.access_token, {
      maxAge: 30 * 24 * 60 * 60, // 30天过期
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // 设置 refresh token
    setCookie('refresh_token', session.refresh_token, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  };

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

  const updateEmailError = (email:string) => {
    if (!email) {
      setEmailError('');
      return;
    }
    if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
      setEmailError(t('common.emailInvalid'));
      return;
    }
    setEmailError('');
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (mode === 'register') {
      updatePasswordError(newPassword);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (mode === 'register') {
      updateEmailError(newEmail);
    }
  }

  const handleSendVerificationCode = async () => {
    if (!email || countdown > 0) return;

    if (mode === 'register' && !isPasswordValid(password)) {
      return;
    }

    // 如果已经注册过，提示已注册
    const { data: user } = await client
      .from('user_profiles')
      .select('user_id')
      .eq('email', email)
      .single();

    if (user) {
      toast.error(t('register.emailRegistered'));
      return;
    }

    setIsSignupLoading(true);
    setLoading(true);
    try {
      const { error } = await client.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      toast.success(t('register.codeSent'));

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
      toast.error(error.message || t('register.sendCodeError'));
    } finally {
      setIsSignupLoading(false);
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      if (password.length < 6) {
        throw new Error(t('login.passwordTooShort'));
      }

      // 1.注册并创建用户
      const { data:signUpData, error: authError } = await client.auth.signUp({
        email: email,           // 用户的邮箱
        password: password,     // 用户的密码
      });

      if (authError) {
        console.error('注册失败:', authError);
      } else {
        toast.success(t('login.registerSuccess'));
        console.log('注册成功');
        console.log(signUpData.user);
      }

      if (!signUpData.session) {
        // 设置cookie
        // 保存 token
        saveAuthToken(signUpData.session);
      }

      // // 2.验证真人
      // const { error } = await client.auth.verifyOtp({
      //   email,
      //   token: verificationCode,
      //   type: 'signup',
      // });
      //
      // if (error) {
      //   toast(error.message || t('register.sendCodeError'));
      // }

      const { error: profileError } = await client
        .from('user_profiles')
        .insert([
          {
            user_id: (await client.auth.getUser()).data.user?.id,
            email,
            created_at: new Date().toISOString(),
          }
        ]);

      if (profileError) throw profileError;

      router.push('/profile');
    } catch (error: any) {
      console.error('注册失败:', error);
      toast.error(error.message || t('login.registerError'));
    }
  };

  const handleLogin = async () => {
    try {
      // // 1. 先检查邮箱是否存在
      // const { data: userProfile } = await client
      //   .from('user_profiles')
      //   .select('*')
      //   .eq('email', email)
      //   .single();
      //
      // if (!userProfile) {
      //   toast.error(t('login.emailNotFound'));
      //   return;
      // }

      //2. 尝试登录
      console.log(email, password);
      const { error, data } = await client.auth.signInWithPassword({
        email: email,
        password: password,
      });

      console.log('登录结果:', data);

      if (error) {
        // 根据错误类型显示不同的提示
        if (error.message === 'Invalid login credentials') {
          toast.error(t('login.invalidPassword'));
        } else {
          throw error;
        }
        return;
      }

      // 保存 token
      if (data.session) {
        // 确保 token 被正确设置
        saveAuthToken(data.session);

        // 添加调试日志
        console.log('Login successful:', {
          session: data.session,
          token: data.session.access_token
        });

        toast.success(t('login.loginSuccess'));

        // 使用 await 确保路由跳转完成
        await router.push('/profile');
      } else {
        throw new Error('No session data received');
      }
    } catch (error: any) {
      console.error('登录失败:', error);
      toast.error(t('login.loginError'));
    }
  };

  const validateLoginForm = () => {
    if (!email) {
      toast.error(t('login.emailRequired'));
      return false;
    }
    if (!password) {
      toast.error(t('login.passwordRequired'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login' && !validateLoginForm()) {
      return;
    }

    if (mode === 'register' && !isPasswordValid(password)) {
      return;
    }

    setIsSignupLoading(true);
    setLoading(true);

    try {
      if (mode === 'register') {
        await handleRegister();
      } else {
        await handleLogin();
      }
    } finally {
      setIsSignupLoading(false);
      setLoading(false);
    }
  };

  const handleModeChange = () => {
    setIsChanging(true);
    setTimeout(() => {
      onModeChange(mode === 'login' ? 'register' : 'login');
      setIsChanging(false);
    }, 300);
  };
  // 添加自动刷新 token 的逻辑
  useEffect(() => {
    const setupTokenRefresh = async () => {
      // 监听认证状态变化
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            saveAuthToken(session);
          } else if (event === 'SIGNED_OUT') {
            // 清除 token
            setCookie('token', '', { maxAge: 0 });
            setCookie('refresh_token', '', { maxAge: 0 });
          }
        }
      );

      // 组件卸载时清理订阅
      return () => {
        subscription.unsubscribe();
      };
    };

    setupTokenRefresh();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('common.email')}
        </label>
        <div className="relative mt-1">
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('common.emailPlaceholder')}
            required
          />
          {(emailError && mode === 'register') && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              {emailError}
            </p>
          )}
        </div>

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
            className="
            block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border
            border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500
            dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
            placeholder={t('common.passwordPlaceholder')}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="hover:bg-transparent absolute inset-y-0 right-0 flex items-center pr-3 bg-transparent border-none outline-none focus:outline-none"
          >
            {showPassword ? (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {(passwordError && mode === 'register') && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">
            {passwordError}
          </p>
        )}
      </div>

      <div
        className={`transform transition-all duration-300 ease-in-out ${
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
          className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300
          dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t('common.codePlaceholder')}
          required={mode === 'register'}
        />
      </div>

      <div className={`transform transition-all duration-300 ease-in-out ${isChanging ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <button
          type="submit"
          disabled={isSignupLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 hover:text-white"
        >
          {isSignupLoading && (mode === 'login')
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
