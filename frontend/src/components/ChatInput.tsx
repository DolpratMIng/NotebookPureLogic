import { FormEvent, KeyboardEvent, ReactNode } from "react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e?: FormEvent) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  sendIcon?: ReactNode;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  placeholder = "Message AI Note Assistant...",
  disabled = false,
  sendIcon,
}: ChatInputProps) {
  return (
    <div className="border-t border-zinc-700 bg-zinc-900 p-3 sm:p-4">
      <form
        onSubmit={onSubmit}
        className="mx-auto flex max-w-3xl items-end gap-2 sm:gap-3"
      >
        <textarea
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="min-h-[52px] max-h-[200px] flex-1 resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          rows={1}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={!value.trim() || disabled}
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sendIcon || (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
          <span className="sr-only">Send message</span>
        </button>
      </form>
      <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-zinc-500">
        AI can make mistakes. Consider checking important information.
      </p>
    </div>
  );
}
