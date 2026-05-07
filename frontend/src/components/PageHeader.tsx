import { ReactNode } from "react";

interface PageHeaderProps {
  icon?: ReactNode;
  title: string;
}

export default function PageHeader({ icon, title }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-center border-b border-zinc-700 px-4 py-3">
      <div className="flex items-center gap-2">
        {icon}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </header>
  );
}
