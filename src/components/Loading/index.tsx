import React, { useEffect } from "react";

interface LoadingProps {
  progress?: number;
  onComplete: () => void;
}

const Loading: React.FC<LoadingProps> = ({ progress, onComplete }) => {
  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        onComplete();
      }, 1000); // 等待3秒后通知父组件加载完成
    }
  }, [progress, onComplete]);

  return (
    <div className="flex flex-col justify-center gap-1 items-center h-screen bg-white dark:bg-background-dark-0">
      {
        progress === 100 ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               className="w-16 h-16 text-green-500 dark:text-green-400">
            <path fill="currentColor"
                  d="M9 16.172l-3.5-3.5a1 1 0 0 1 1.414-1.414L9 13.344l7.086-7.085a1 1 0 0 1 1.414 1.414L9 16.172z"/>
          </svg>
        ) : (
          <svg className="size-10 animate-spin dark:text-white text-black"
               xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )
      }
      {
        progress && <span className="text-lg dark:text-white text-black">{Math.min(progress, 100).toFixed(0)}%</span>
      }
    </div>
  );
};

export default Loading;
