import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  HomeOutlined,
  InfoCircleOutlined,
  CameraOutlined,
  GlobalOutlined,
  SunOutlined,
  MoonOutlined,
  PlayCircleOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import {sleep, storage} from "@/utils";
import { useRouter } from 'next/router';
import { useLoading } from '@/context/LoadingContext';
import { setCookie } from 'cookies-next';  // 用于设置 cookie

const Index = () => {
  const { setLoading } = useLoading();
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

  const router = useRouter();
  const { locale,asPath,query } = router

  const changeLanguage = async (lng: string) => {
    console.log('changeLanguage', lng);

    setLoading(true);
    await sleep(500);  // 模拟网络请求延迟
    //storage('set', 'i18nextLng', lng);
    setCookie('i18nextLng', lng);  // 将语言存储在 cookie
    await i18n.changeLanguage(lng);
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
            <PlayCircleOutlined className="icon-style text-2xl" />
          </Link>
        </li>
        <li>
          <GlobalOutlined
            className="icon-style text-2xl cursor-pointer"
            onClick={() => {
              changeLanguage(i18n.language === 'en' ? 'zh' : 'en')
                .then(() => {
                  console.log('change language success',i18n.language);
                  console.log('router',locale,asPath,query);
                  router.push({ query }, asPath, { locale: i18n.language })
                    .then(() => setLoading(false));
                });
            }}
          />
        </li>
        <li>
          {localTheme === 'light' ? (
            <MoonOutlined
              className="icon-style text-2xl cursor-pointer"
              onClick={() => {
                setTheme('dark');
                storage('set', 'theme', 'dark');
              }}
            />
          ) : (
            <SunOutlined
              className="icon-style text-2xl cursor-pointer"
              onClick={() => {
                setTheme('light');
                storage('set', 'theme', 'light');
              }}
            />
          )}
        </li>
        <li>
          <Link href='/login'>
            <LoginOutlined className="icon-style text-2xl" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Index;
