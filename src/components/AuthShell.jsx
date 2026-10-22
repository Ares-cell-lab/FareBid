// AuthShell - the two-column layout shared by Sign in and Sign up.
// Left: a FareBid ride illustration. Right: the form.
import { motion } from "motion/react";
import PageTransition from "./PageTransition.jsx";
import RideRoute from "./RideRoute.jsx";
import Logo from "./Logo.jsx";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <PageTransition className="grid min-h-screen bg-slate-50 text-slate-900 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="hidden flex-col justify-between gap-10 bg-slate-950 p-10 text-white lg:flex xl:p-14">
        <Logo inverted />
        <div className="grid gap-6">
          <RideRoute className="max-h-56 text-emerald-400" />
          <p className="font-sans text-3xl font-semibold leading-tight">
            “My ride, my route, right on time.”
          </p>
          <p className="text-sm text-slate-400">The easier way to get there with FareBid.</p>
        </div>
        <ul className="grid gap-3 text-sm text-slate-300" aria-label="Account types">
          <li><span className="mr-2 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300">Driver</span> earn on every trip</li>
          <li><span className="mr-2 rounded-full bg-sky-400/15 px-3 py-1 text-xs font-bold text-sky-300">Passenger</span> get where you need to go</li>
        </ul>
      </aside>

      <main className="grid place-items-center px-5 py-12 sm:px-8">
        <motion.div
          className="grid w-full max-w-md gap-2"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6 lg:hidden"><Logo /></div>
          <h1 className="font-sans text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          <p className="text-slate-600">{subtitle}</p>
          {children}
        </motion.div>
      </main>
    </PageTransition>
  );
}
