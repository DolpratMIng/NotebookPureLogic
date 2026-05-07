"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/CreateNote", label: "Create Note" },
    { href: "/ShowList", label: "Show List" },
    { href: "/NoteAI", label: "Note AI" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="border-b border-zinc-700 bg-zinc-900 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          NoteBookPureLogic
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 sm:flex sm:gap-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-lg px-2 py-1 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-emerald-400"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center rounded-lg p-2 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-emerald-400 sm:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <ul className="mt-3 flex flex-col gap-1 border-t border-zinc-700 pt-3 sm:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-emerald-400"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
