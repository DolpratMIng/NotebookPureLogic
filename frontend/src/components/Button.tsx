import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  ...rest
}: ButtonProps) {
  const variants = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-500 disabled:hover:bg-emerald-600",
    danger:
      "bg-red-600 text-white hover:bg-red-500 disabled:hover:bg-red-600",
    ghost:
      "bg-transparent text-zinc-300 hover:bg-zinc-800 disabled:hover:bg-transparent",
  };

  return (
    <button
      className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
      {...rest}
    >
      {children}
    </button>
  );
}
