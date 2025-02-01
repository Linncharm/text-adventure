import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HomeOutlined, InfoCircleOutlined, CameraOutlined, GlobalOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { storage } from "@/utils";

const Index = () => {
  const { i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [localTheme, setLocalTheme] = useState<string>('light');

  useEffect(() => {
    const storedTheme = storage('get', 'theme');
    if (storedTheme) {
      setLocalTheme(storedTheme);
    } else {
      theme && setLocalTheme(theme);
    }
  }, [theme]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (localTheme === null) {
    return null; // or a loading spinner
  }

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
          {localTheme === 'dark' ? (
            <SunOutlined
              className="icon-style text-2xl cursor-pointer"
              onClick={() => {
                setTheme('light');
                storage('set', 'theme', 'light');
              }}
            />
          ) : (
            <MoonOutlined
              className="icon-style text-2xl cursor-pointer"
              onClick={() => {
                setTheme('dark');
                storage('set', 'theme', 'dark');
              }}
            />
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Index;
