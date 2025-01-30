import {ReactNode} from 'react';
import NavBar from "@/components/Layout/components/NavBar";
import FootBar from "@/components/Layout/components/FootBar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}: LayoutProps) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <FootBar />
    </>
  );
}
