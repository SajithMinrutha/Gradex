// src/components/Card.jsx
export default function Card({ title, children, className = "" }) {
  return (
    <div
      className={`bg-[#071029]/65 backdrop-blur-xl border border-white/6 rounded-2xl shadow-2xl p-5 ${className}`}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}
