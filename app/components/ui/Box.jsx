export default function Box({ children, className = "" }) {
  return (
    <div
      className={`border border-gray-400 rounded-[16px] px-2 py-4 bg-slate-800 ${className}`}
    >
      <div className="w-full h-full border border-dashed border-white flex items-center justify-center text-white">
        {children}
      </div>
    </div>
  );
}
