import Link from "next/link";
export default function Navbar() {
  return (
    <div className="flex justify-between px-[5vh] border-2 border-yellow-600">
      {/*Logo */}
      <div className="text-2xl">
        <Link href="/">NoteBookPureLogic</Link>
      </div>
      {/*Menus here */}
      <ul className="flex gap-[5vh]">
        <Link href="/CreateNote" className="border-2 border-red-500">
          Create note
        </Link>
        <Link href="/ShowList" className="border-2 border-red-500">
          Show list
        </Link>
        <Link href="/NoteAI" className="border-2 border-red-500">
          Note AI
        </Link>
      </ul>
    </div>
  );
}
