import React from 'react';
import LoginPage from '@/components/Login';
// import { useUser } from '@/hooks/useUser'; // 假设你有一个用户hook

const Login:React.FC = () => {
//   const router = useRouter();
//   const { user, isLoading } = useUser();

//   useEffect(() => {
//     // 如果用户已登录，重定向到个人信息页面
//     if (user && !isLoading) {
//       router.push('/profile');
//     }
//   }, [user, isLoading, router]);

//   // 如果正在加载用户信息，可以显示加载状态
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

  // 如果用户未登录，显示登录页面
  return <LoginPage />;
};

export default Login;