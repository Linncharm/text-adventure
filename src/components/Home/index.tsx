import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from "next-themes";

const Home: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation('home');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center">
      <section className="w-full pt-32">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-200">
              {t('feature.title')} ❤️
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('feature.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-white/70 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl dark:text-gray-200 font-semibold mb-4">
                <span className="mr-2">🖼️</span>
                {t('feature.content.first.title')}
              </h3>
              <p className="text-gray-500 dark:text-gray-300">
                {t('feature.content.first.description')}
              </p>
            </div>

            <div className="bg-white/70 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl dark:text-gray-200 font-semibold mb-4">
                <span className="mr-2">⚡</span>
                {t('feature.content.second.title')}
              </h3>
              <p className="text-gray-500 dark:text-gray-300">
                {t('feature.content.second.description')}
              </p>
            </div>

            <div className="bg-white/70 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl dark:text-gray-200 font-semibold mb-4">
                <span className="mr-2">🧠</span>
                {t('feature.content.third.title')}
              </h3>
              <p className="text-gray-500 dark:text-gray-300">
                {t('feature.content.third.description')}
              </p>
            </div>

            <div className="bg-white/70 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl dark:text-gray-200 font-semibold mb-4">
                <span className="mr-2">📊</span>
                {t('feature.content.fourth.title')}
              </h3>
              <p className="text-gray-500 dark:text-gray-300">
                {t('feature.content.fourth.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>)
}

export default Home;
