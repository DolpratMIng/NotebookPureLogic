"use client";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first.");
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
          }),
        },
      );

      if (!response.ok) {
        const err = await response.json();
        alert(err.error || "Something went wrong");
        return;
      }

      const data = await response.json();
      console.log(data);

      alert("Note is successfully created.");
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("error", error);
      alert("Network error");
    }
  }

  return (
    <PageLayout>
      <PageHeader
        icon={
          <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }
        title="Create Note"
      />

      <div className="flex flex-1 items-start justify-center overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-2xl p-4 sm:p-6"
        >
          <div className="space-y-4">
            <InputField
              as="input"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
            />

            <InputField
              as="textarea"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your note here..."
              rows={10}
            />

            <div className="flex gap-3">
              <Button type="submit">Save</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setTitle("");
                  setContent("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
