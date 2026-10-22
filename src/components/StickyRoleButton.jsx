import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { FiSend, FiNavigation, FiShield, FiAlertTriangle } from "react-icons/fi";

export default function StickyRoleButton({ role, alertCount = 0 }) {
  const navigate = useNavigate();

  if (role === "passenger") {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <motion.button
          onClick={() => navigate("/passenger/book")}
          className="group relative flex items-center gap-3 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/25 ring-4 ring-emerald-500/20 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-95"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="relative flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-white" />
          </span>
          <FiSend className="size-5 transition-transform group-hover:translate-x-0.5" />
          <span>Book a Ride</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
            Bid Live
          </span>
        </motion.button>
      </div>
    );
  }

  if (role === "driver") {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <motion.button
          onClick={() => navigate("/driver/console")}
          className="group relative flex items-center gap-3 rounded-full bg-linear-to-r from-amber-500 to-orange-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-amber-500/25 ring-4 ring-amber-500/20 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/40 active:scale-95"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="relative flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-200 opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-white" />
          </span>
          <FiNavigation className="size-5 transition-transform group-hover:rotate-12" />
          <span>Driver Radar & Console</span>
        </motion.button>
      </div>
    );
  }

  if (role === "admin") {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <motion.button
          onClick={() => navigate("/admin/ops")}
          className="group relative flex items-center gap-3 rounded-full bg-linear-to-r from-slate-900 to-indigo-950 px-6 py-4 text-base font-bold text-white shadow-xl shadow-indigo-950/30 ring-4 ring-indigo-500/20 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-indigo-900/50 active:scale-95"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          {alertCount > 0 ? (
            <span className="flex size-6 items-center justify-center rounded-full bg-rose-500 text-xs font-extrabold text-white animate-bounce">
              <FiAlertTriangle className="size-3.5" />
            </span>
          ) : (
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-indigo-300" />
            </span>
          )}
          <FiShield className="size-5 transition-transform group-hover:scale-110" />
          <span>Ops Control Center</span>
          {alertCount > 0 && (
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide text-white">
              {alertCount} SOS Alert{alertCount > 1 ? "s" : ""}
            </span>
          )}
        </motion.button>
      </div>
    );
  }

  return null;
}
