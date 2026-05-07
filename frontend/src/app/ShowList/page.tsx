"use client";
import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import InputField from "@/components/InputField";

type noteListType = {
  id: number | undefined;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function ShowList() {
  const [noteList, setNoteList] = useState<noteListType[]>([]);
  const [selectedNote, setSelectedNote] = useState<noteListType>({
    id: undefined,
    title: "",
    content: "",
    createdAt: "",
    updatedAt: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [mobileShowNote, setMobileShowNote] = useState(false);

  function handleEdit(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  }

  function handleTitleContentChange(e: React.ChangeEvent<any>) {
    const newValue = e.target.value;
    setSelectedNote((prevState) => ({
      ...prevState,
      [e.target.name]: newValue,
    }));
  }

  async function handleUpdate(e: any) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/notes`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: selectedNote.id,
            title: selectedNote.title,
            content: selectedNote.content,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("updating error");
        alert("Updating error");
      }

      const data = await response.json();

      alert("Note is successfully updated");

      setNoteList((prev) =>
        prev.map((note) =>
          note.id === selectedNote.id
            ? {
                ...note,
                title: selectedNote.title,
                content: selectedNote.content,
              }
            : note,
        ),
      );

      setIsEditing(false);
    } catch (error) {
      console.error("error", error);
    }
  }

  async function handleDelete(e: any) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/notes`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: selectedNote.id,
          }),
        },
      );

      if (!response.ok) {
        const err = await response.json();
        alert(err.error || "Something went wrong");
        return;
      }

      alert("Note is successfully deleted.");

      setNoteList((prev) => prev.filter((note) => note.id !== selectedNote.id));

      setSelectedNote({
        id: undefined,
        title: "",
        content: "",
        createdAt: "",
        updatedAt: "",
      });
      setMobileShowNote(false);
    } catch (error) {
      console.error("error:", error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/notes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) {
          console.error("Failed to fetch notes");
          return;
        }
        const result = await response.json();
        setNoteList(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Error", error);
      }
    }
    fetchData();
  }, []);

  function selectNote(note: noteListType) {
    setSelectedNote(note);
    setIsEditing(false);
    setMobileShowNote(true);
  }

  const noteIcon = (
    <svg
      className="h-8 w-8 text-emerald-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  return (
    <PageLayout>
      <PageHeader
        icon={
          <svg
            className="h-5 w-5 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        }
        title="Your Notes"
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`w-full flex-shrink-0 overflow-y-auto border-r border-zinc-700 bg-zinc-900 p-4 sm:w-80 ${
            mobileShowNote ? "hidden sm:block" : ""
          }`}
        >
          <div className="mb-4">
            <p className="text-sm text-zinc-400">
              {noteList.length} notes saved
            </p>
          </div>

          {noteList.length === 0 ? (
            <p className="text-center text-sm text-zinc-500">No notes yet</p>
          ) : (
            <div className="space-y-2">
              {noteList.map((note) => (
                <button
                  key={note.id}
                  onClick={() => selectNote(note)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${
                    selectedNote.id === note.id
                      ? "border-emerald-500 bg-zinc-800"
                      : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800"
                  }`}
                >
                  <h2 className="truncate text-sm font-medium text-zinc-100">
                    {note.title}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    {new Date(note.createdAt).toLocaleDateString() || "No date"}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main content */}
        <div
          className={`flex-1 overflow-y-auto ${
            !mobileShowNote ? "hidden sm:block" : ""
          }`}
        >
          <form onSubmit={handleUpdate} className="h-full">
            {selectedNote.id ? (
              isEditing ? (
                <div className="p-4 sm:p-6">
                  <div className="mb-4">
                    <InputField
                      as="input"
                      name="title"
                      value={selectedNote.title}
                      onChange={handleTitleContentChange}
                      placeholder="Note title..."
                    />
                  </div>

                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs text-zinc-500">
                      {new Date(selectedNote.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Button type="submit">Save</Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>

                  <InputField
                    as="textarea"
                    name="content"
                    value={selectedNote.content}
                    onChange={handleTitleContentChange}
                    placeholder="Note content..."
                    rows={12}
                  />
                </div>
              ) : (
                <div className="p-4 sm:p-6">
                  <div className="mb-2 flex items-start justify-between">
                    <h1 className="text-xl font-semibold text-zinc-100">
                      {selectedNote.title}
                    </h1>
                    <button
                      onClick={() => setMobileShowNote(false)}
                      className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 sm:hidden"
                      aria-label="Back to notes"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs text-zinc-500">
                      {new Date(selectedNote.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Button type="button" onClick={handleEdit}>
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                      {selectedNote.content}
                    </p>
                  </div>
                </div>
              )
            ) : (
              <EmptyState
                icon={noteIcon}
                title="Choose a note"
                description="Select a note from the sidebar to view its content"
              />
            )}
          </form>
        </div>
      </div>
    </PageLayout>
  );
}
