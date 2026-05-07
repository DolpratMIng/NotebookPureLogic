import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputFieldBaseProps {
  label?: string;
  error?: string;
}

type InputProps = InputFieldBaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
    as?: "input";
  };

type TextareaProps = InputFieldBaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
    as: "textarea";
  };

type InputFieldProps = InputProps | TextareaProps;

export default function InputField(props: InputFieldProps) {
  const { label, error, as, ...rest } = props;

  const baseClasses =
    "w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-zinc-300">{label}</label>
      )}
      {as === "textarea" ? (
        <textarea
          className={`${baseClasses} resize-none`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={baseClasses}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
