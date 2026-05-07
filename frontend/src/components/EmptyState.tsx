import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex h-[40vh] sm:h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
        {icon}
      </div>
      <h2 className="mb-2 text-2xl font-semibold">{title}</h2>
      {description && (
        <p className="max-w-md text-zinc-400">{description}</p>
      )}
    </div>
  );
}
