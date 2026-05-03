"use client";
import { useState } from "react";
export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      //fetching data
      const response = await fetch("http://localhost:8000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.error || "Something went wrong");
        return;
      }

      const data = await response.json();
      console.log(data);

      alert("Note is successfully created.");
      // clear form
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("error", error);
      alert("Network error");
    }
  }

  return (
    <div>
      {/*title */}
      <div className="text-3xl text-center">Create your note</div>

      {/*form for adding title and content */}
      <form onSubmit={handleSubmit}>
        {/*title and text for user input */}
        <div className="flex flex-col items-center justify-center p-[5vh] gap-[3vh]">
          <input
            name="title"
            className="border-2 border-red-500 w-[20%] text-xl"
            placeholder="Type your title here..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            name="content"
            value={content}
            className="w-full min-h-[30vh] text-xl flex border-2 border-blue-500"
            placeholder="Type your note here..."
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          {/*Save and cancel button */}
          <div className="flex gap-5 text-lg">
            <button
              type="submit"
              className="bg-green-500 px-[3vh] cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setContent("");
              }}
              className="bg-red-500 px-[3vh] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
