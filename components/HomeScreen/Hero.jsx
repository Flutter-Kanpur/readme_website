import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full py-24 px-6 flex flex-col items-center text-center  relative">
      <p className="text-[11px] tracking-widest text-black uppercase mb-6">
        Connect with designers, writers, and creatives.
      </p>
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-black max-w-4xl">
        A space for people who <br />
        design with <span className="text-blue-500">passion</span>
      </h1>
      <p className="mt-6 text-gray-500 max-w-2xl text-sm md:text-base">
        Readme is a reader-first community focused on learning, building, and growing
        together through articles, collaboration, and real-world design practice.
      </p>
      <div className="mt-10 flex gap-4">
        <Link href="/editor">
          <button className="bg-black text-white px-8 py-5 rounded-full text-sm font-medium flex items-center gap-2 hover:opacity-90">
            Start Typing →
          </button>
        </Link>
        <Link href="/articles">
          <button className="border border-gray-300 px-8 py-5 rounded-full text-sm font-medium text-black hover:bg-gray-50">
            Explore Topics →
          </button>
        </Link>
      </div>
    </section>
  );
}
