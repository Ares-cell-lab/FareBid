import { Link } from "react-router-dom";

export default function Logo({ to = "/", inverted = false }) {
  return (
    <Link className={`inline-flex items-center gap-2.5 font-sans text-2xl font-extrabold tracking-tight no-underline ${inverted ? "text-white" : "text-slate-950"}`} to={to} aria-label="FareBid home">
      <span className="grid size-10 place-items-center rounded-xl bg-emerald-500 text-white" aria-hidden="true">
        <svg className="size-6" viewBox="0 0 24 24" fill="none">
          <path d="M5 11.5 6.8 6.8A2.8 2.8 0 0 1 9.4 5h5.2a2.8 2.8 0 0 1 2.6 1.8l1.8 4.7M4 11.5h16v6a1 1 0 0 1-1 1h-1.5v-2h-11v2H5a1 1 0 0 1-1-1v-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M7.5 14.5h.01M16.5 14.5h.01M8 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span>Fare<span className="text-emerald-600">Bid</span></span>
    </Link>
  );
}
