import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export default function Home() {
  const pages = [
    {
      href: "/CreateNote",
      label: "Create Note",
      description: "Write and save a new note",
    },
    {
      href: "/ShowList",
      label: "Note List",
      description: "Browse, edit, and delete your notes",
    },
    {
      href: "/NoteAI",
      label: "Note AI",
      description: "Chat with AI about your notes",
    },
  ];

  return (
    <PageLayout>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <h1 className="mb-2 text-3xl font-semibold text-zinc-100">
          NoteBookPureLogic
        </h1>
        <p className="mb-10 text-zinc-400">
          Your personal note-taking workspace
        </p>
        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="flex flex-col items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 p-6 text-center transition-colors hover:border-emerald-500 hover:bg-zinc-800/80"
            >
              <span className="text-lg font-medium text-zinc-100">
                {page.label}
              </span>
              <span className="text-sm text-zinc-400">{page.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
