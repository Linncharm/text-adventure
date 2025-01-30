import Link from 'next/link';
import {HomeOutlined, InfoCircleOutlined, CameraOutlined, GlobalOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';

const NavBar = () => {
  const {i18n} = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent flex items-center p-4 z-50">
      <ul className="flex gap-4">
        <li>
          <Link href='/'>
            <HomeOutlined className="text-white opacity-80 hover:opacity-100 transition-opacity text-2xl"/>
          </Link>
        </li>
        <li>
          <Link href='/about'>
            <InfoCircleOutlined className="text-white opacity-80 hover:opacity-100 transition-opacity text-2xl"/>
          </Link>
        </li>
        <li>
          <Link href='/game'>
            <CameraOutlined className="text-white opacity-80 hover:opacity-100 transition-opacity text-2xl"/>
          </Link>
        </li>
        <li>
          <GlobalOutlined
            className="text-white opacity-80 hover:opacity-100 transition-opacity text-2xl cursor-pointer"
            onClick={() => changeLanguage(i18n.language === 'en' ? 'zh' : 'en')}
          />
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
