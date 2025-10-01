export default function Card({ title, children, className = "" }) {
  return (
    <div
      className={`bg-[#071029]/70 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-5 ${className}`}
    >
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
}
