import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-zinc-900 text-zinc-100">
      {children}
    </div>
  );
}
