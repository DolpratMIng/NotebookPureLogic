"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";

type Note = {
  id: number;
  title: string;
  content: string;
  createdAt?: string;
};

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchNotes() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const data = await res.json();
      setNotes(Array.isArray(data) ? data : []);
    }

    fetchNotes();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  const noteIcon = (
    <svg className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <PageLayout>
      <PageHeader
        icon={
          <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        }
        title="Dashboard"
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-zinc-400">
              {notes.length} notes saved
            </p>
            <div className="flex gap-2">
              <Link href="/CreateNote">
                <Button>New Note</Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          {notes.length === 0 ? (
            <EmptyState
              icon={noteIcon}
              title="No notes yet"
              description="Create your first note to get started"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {notes.map((note) => (
                <Link
                  key={note.id}
                  href="/ShowList"
                  className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 transition-colors hover:border-emerald-500"
                >
                  <h3 className="truncate text-sm font-medium text-zinc-100">
                    {note.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-400">
                    {note.content}
                  </p>
                  {note.createdAt && (
                    <p className="mt-3 text-xs text-zinc-600">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
