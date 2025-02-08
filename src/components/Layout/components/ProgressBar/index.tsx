import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 自定义样式
NProgress.configure({
  showSpinner: false,
  speed: 500,
  trickleSpeed: 200,
});

const ProgressBar = ({ isLoading }: { isLoading: boolean }) => {
  useEffect(() => {
    if (isLoading) {
      NProgress.start();
      NProgress.set(0.3);
      NProgress.set(0.5);
    } else {
      NProgress.done();
    }
  }, [isLoading]);

  return null; // 组件不渲染 UI，只控制进度条
};

export default ProgressBar;
