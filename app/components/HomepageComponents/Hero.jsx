import Link from "next/link";

const HERO_CONTENT = {
  tagline: "Connect with designers, writers, and creatives.",
  title: (
    <>
      A space where communities <br />
      share their <span className="text-blue-500">journey</span>
    </>
  ),
  description:
    "Readme is a reader-first community focused on learning, building, and growing together through articles, collaboration, and real-world design practice.",
  actions: [
    {
      label: "Start Writing",
      href: "/write",
      primary: true,
    },
    {
      label: "Explore Topics →",
      href: "/articles",
      primary: false,
    },
  ],
};

export default function Hero() {
  return (
    <section className="w-full min-h-[60vh] md:min-h-[70vh] pt-20 md:pt-32 pb-16 md:pb-24 px-6 flex flex-col items-center justify-center text-center relative max-w-7xl mx-auto opacity-0 animate-[fade-in_0.5s_ease-out_forwards]">
      <p className="text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.25em] text-black uppercase mb-6 md:mb-8 font-semibold opacity-60">
        {HERO_CONTENT.tagline}
      </p>

      <h1
        style={{
          fontSize: 'clamp(36px, 9vw, 80px)',
          fontWeight: '700',
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
          color: '#000',
          textAlign: 'center',
          maxWidth: '1100px',
          margin: '0 auto 24px'
        }}
      >
        {HERO_CONTENT.title}
      </h1>

      <p className="text-gray-500 max-w-2xl text-sm md:text-lg text-center mx-auto mb-8 md:mb-12 leading-relaxed px-2">
        {HERO_CONTENT.description}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mx-auto w-full sm:w-auto">
        {HERO_CONTENT.actions.map((action) => (
          <Link key={action.label} href={action.href} className="w-full sm:w-auto">
            <button
              className={
                action.primary
                  ? "w-full sm:w-auto bg-black text-white px-8 md:px-10 py-4 md:py-5 rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all cursor-pointer shadow-lg active:scale-95"
                  : "w-full sm:w-auto bg-white border border-gray-200 px-8 md:px-10 py-4 md:py-5 rounded-full text-sm font-bold text-black hover:bg-gray-50 transition-all cursor-pointer shadow-sm active:scale-95"
              }
            >
              {action.label}
            </button>
          </Link>
        ))}
      </div>
    </section>
  );
}
