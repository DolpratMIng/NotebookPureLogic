"use client";
import { useState, useEffect } from "react";
type noteListType = {
  id: number | undefined;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
type updateNoteType = {
  title: string;
  content: string;
};
export default function ShowList() {
  // noteList which store all the notes
  const [noteList, setNoteList] = useState<noteListType[]>([]);
  // state to show the status of note clicking
  const [selectedNote, setSelectedNote] = useState<noteListType>({
    id: undefined,
    title: "",
    content: "",
    createdAt: "",
    updatedAt: "",
  });
  // state to know the status of edit button is being clicked
  const [isEditing, setIsEditing] = useState<boolean>(false);

  //function when the user click on edit button
  function handleEdit() {
    setIsEditing(true);
  }

  //for updating title
  function handleTitleContentChange(e: React.ChangeEvent<any>) {
    const newValue = e.target.value;

    // Use a functional update to ensure you have the latest state
    setSelectedNote((prevState) => ({
      ...prevState, // 1. Copy all existing properties (title, content)
      [e.target.name]: newValue, // 2. Overwrite ONLY the title property
    }));
  }

  async function handleUpdate(e: any) {
    e.preventDefault();
    try {
      //fetch
      const response = await fetch("http://localhost:8000/notes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedNote.id,
          title: selectedNote.title,
          content: selectedNote.content,
        }),
      });

      if (!response.ok) {
        throw new Error("updating error");
        alert("Updating error");
      }

      const data = await response.json();

      alert("Noted is successfully updated");

      //update noteList
      setNoteList((prev) =>
        prev.map((note) =>
          note.id === data.id
            ? {
                ...note,
                title: data.title,
                content: data.content,
                updatedAt: data.updatedAt,
              }
            : note,
        ),
      );

      //update selectedNote
      // setSelectedNote((prev) => ({
      //   ...prev,
      //   title: data.title,
      //   content: data.content,
      //   updatedAt: data.updatedAt,
      // }));

      //reset editing mode
      setIsEditing(false);
    } catch (error) {
      console.error("error", error);
    }
  }

  //for delete
  async function handleDelete(e: any) {
    try {
      const response = await fetch("http://localhost:8000/notes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedNote.id,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.error || "Something went wrong");
        return;
      }

      alert("Note is successfully deleted.");

      //update noteList
      setNoteList((prev) => prev.filter((note) => note.id !== selectedNote.id));

      setSelectedNote({
        id: undefined,
        title: "",
        content: "",
        createdAt: "",
        updatedAt: "",
      });
    } catch (error) {
      console.error("error:", error);
    }
  }

  //useEffect for first render
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8000/notes");
        const result = await response.json();
        setNoteList(result);
      } catch (error) {
        console.error("Error", error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="flex h-full w-full">
      {/*sidebar to show each note */}
      <div className="w-[30%] border-2 border-green-500 min-h-screen p-[2vh] cursor-pointer">
        {/*for telling the amount of notes */}
        <div className="bg-white h-[5%] mb-[3vh]">
          <h1 className="text-lg">Your Notes</h1>
          <p>{noteList.length} notes saved</p>
        </div>
        {noteList.map((note) => (
          <div
            key={note.id}
            onClick={() => {
              setSelectedNote(note);
              setIsEditing(false);
            }}
            className="border-2 border-blue-500 mb-[2vh] p-[1vh]"
          >
            <h2>Title: {note.title}</h2>
            {/*date */}
            <p>
              Date: {new Date(note.createdAt).toLocaleDateString() || "No date"}
            </p>
          </div>
        ))}
      </div>
      {/*To display selected note */}
      <div className="w-[70%] border-2 border-pink-500">
        {/*form tag */}
        <form onSubmit={handleUpdate} className="w-full h-full">
          {/*The whole container of title and content */}
          {selectedNote.id ? (
            isEditing ? (
              <div>
                {/*for adding padding or margin */}
                <div className="p-[2vh]">
                  {/*Section for title,date, and buttons */}
                  <div>
                    {/*Title */}
                    <div className="flex flex-col">
                      <input
                        className="text-2xl"
                        value={selectedNote.title}
                        onChange={handleTitleContentChange}
                        name="title"
                      />
                    </div>

                    {/*Date and buttons */}
                    <div className="flex justify-between text-lg">
                      <p>
                        Date:{" "}
                        {new Date(selectedNote.createdAt).toLocaleDateString()}
                      </p>
                      {/*buttons */}
                      <div className="flex gap-[3vh]">
                        <button type="submit" className="bg-green-500 px-[2vh]">
                          Save
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 px-[2vh]"
                          onClick={() => {
                            setIsEditing(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>

                  {/*Content */}
                  <div className="pt-[2vh]">
                    <textarea
                      className="text-lg"
                      value={selectedNote.content}
                      name="content"
                      onChange={handleTitleContentChange}
                    ></textarea>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-green-700">
                {/*The title,buttons, and createdAt date */}
                <div className="flex flex-col p-[2vh]">
                  {/*Title */}
                  <h1 className="text-2xl">{selectedNote.title}</h1>
                  {/*the date and buttons */}
                  <div className="flex text-lg justify-between">
                    {/*the date */}
                    <div>
                      Date:{" "}
                      {new Date(selectedNote.createdAt).toLocaleDateString()}
                    </div>
                    {/*buttons */}
                    <div className="flex gap-[3vh]">
                      <button
                        onClick={handleEdit}
                        className="bg-green-500 px-[2vh]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-red-500 px-[2vh]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/*Content */}
                <div className="p-[2vh] text-lg">{selectedNote.content}</div>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <div className=" text-3xl">Choose a note to see its content</div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
