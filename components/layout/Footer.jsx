import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      {/* Box container */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center text-black">
        <h2 className="text-3xl font-semibold mb-10">Readme</h2>

        <div className="flex flex-wrap justify-center gap-12 mb-10">
          <Link
            href="/help"
            className="text-sm tracking-widest uppercase hover:opacity-70"
          >
            Help
          </Link>
          <Link
            href="/status"
            className="text-sm tracking-widest uppercase hover:opacity-70"
          >
            Status
          </Link>
          <Link
            href="/writers"
            className="text-sm tracking-widest uppercase hover:opacity-70"
          >
            Writers
          </Link>
          <Link
            href="/privacy"
            className="text-sm tracking-widest uppercase hover:opacity-70"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm tracking-widest uppercase hover:opacity-70"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}