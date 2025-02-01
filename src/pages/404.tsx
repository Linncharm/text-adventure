import React from 'react';

const Custom404: React.FC = () => {
  return (
    // 居中
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900 dark:text-gray-100">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Page Not Found
        </h2>
      </div>
    </div>

  )
}

export default Custom404
