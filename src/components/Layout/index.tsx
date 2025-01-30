import {ReactNode} from 'react';
import NavBar from "@/components/NavBar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}: LayoutProps) {
  return (
    <>
      <NavBar/>
      <main>{children}</main>
    </>
  );
}
