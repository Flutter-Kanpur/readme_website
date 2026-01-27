import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="text-xl font-bold text-[#000000]">
          Readme
        </div>
        <div className="hidden md:flex gap-8">
          <Link href="/" className="text-blue-500 font-medium">Home</Link>
          <Link href="/articles" className="text-gray-600 hover:text-black">Articles</Link>
          <Link href="/community" className="text-gray-600 hover:text-black">Community</Link>
          <Link href="/events" className="text-gray-600 hover:text-black">Events</Link>
          <Link href="/team" className="text-gray-600 hover:text-black">Team</Link>
        </div>
        <Link
          href="/login"
          className="bg-black text-white px-4 py-2 rounded-full text-sm"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
