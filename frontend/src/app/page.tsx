import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-full">
      {/*Title menu */}
      <div className="text-center text-5xl">Menu</div>
      {/*Menu lists */}
      <div className="text-lg flex flex-col items-center justify-center py-[5vh] border-2 border-blue-500">
        <Link href="/CreateNote">Create note</Link>
        <Link href="/ShowList">Note List</Link>
        <Link href="/NoteAI">Note AI</Link>
      </div>
    </div>
  );
}
