"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const Navbar = dynamic(() => import("@/components/Navbar/Navbar"));
const Footer = dynamic(() => import("@/components/Footer/Footer"));

export default function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard")) return children;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
