import Link from 'next/link';
import { HomeOutlined, InfoCircleOutlined, CameraOutlined, GlobalOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';

const Index = () => {
  const { i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent flex items-center p-4 z-50">
      <ul className="flex gap-4">
        <li>
          <Link href='/'>
            <HomeOutlined className="icon-style text-2xl" />
          </Link>
        </li>
        <li>
          <Link href='/about'>
            <InfoCircleOutlined className="icon-style text-2xl" />
          </Link>
        </li>
        <li>
          <Link href='/game'>
            <CameraOutlined className="icon-style text-2xl" />
          </Link>
        </li>
        <li>
          <GlobalOutlined
            className="icon-style text-2xl cursor-pointer"
            onClick={() => changeLanguage(i18n.language === 'en' ? 'zh' : 'en')}
          />
        </li>
        <li>
          {theme === 'dark' ? (
            <SunOutlined
              className="icon-style text-2xl cursor-pointer"
              onClick={() => setTheme('light')}
            />
          ) : (
            <MoonOutlined
              className="icon-style text-2xl cursor-pointer"
              onClick={() => setTheme('dark')}
            />
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Index;
