import { Link } from "react-router-dom";
import { motion } from "motion/react";
import PageTransition from "../components/PageTransition.jsx";
import RideRoute from "../components/RideRoute.jsx";
import Logo from "../components/Logo.jsx";

const roles = [
  {
    title: "Passengers",
    detail: "Get where you're going with a ride that fits your plans and budget.",
    bullets: ["Request a ride in moments", "See your fare before you go", "Follow your driver to pickup"],
    badge: "bg-sky-100 text-sky-800",
  },
  {
    title: "Drivers",
    detail: "Choose trips that work for you and make every mile count.",
    bullets: ["See ride requests nearby", "Know the fare before accepting", "Track your trip earnings"],
    badge: "bg-amber-100 text-amber-800",
  },
  {
    title: "Admins",
    detail: "Keep the FareBid community moving and manage platform accounts.",
    bullets: ["View driver and passenger accounts", "Monitor platform activity", "Manage account access"],
    badge: "bg-violet-100 text-violet-800",
  },
];

const steps = [
  ["01", "Choose your role", "Join FareBid as a passenger looking for a ride or a driver ready to earn."],
  ["02", "Set your destination", "Passengers share where they’re going; drivers can review ride requests."],
  ["03", "Ride with confidence", "Connect, follow the route, and get there with FareBid."],
];

const reveal = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function Landing() {
  return (
    <PageTransition className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex" aria-label="Main navigation">
            <a className="transition hover:text-emerald-700" href="#how">How it works</a>
            <a className="transition hover:text-emerald-700" href="#roles">For drivers and passengers</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex" to="/signin">
              Sign in
            </Link>
            <Link className="inline-flex rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600" to="/signup">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="overflow-hidden bg-slate-50">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
            <motion.div className="grid gap-7" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
              <motion.p className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800" variants={reveal}>
                <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
                Your city. Your ride. Your FareBid.
              </motion.p>
              <motion.h1 className="max-w-3xl text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl" variants={reveal}>
                A better way to <span className="text-emerald-600">get moving.</span>
              </motion.h1>
              <motion.p className="max-w-xl text-lg leading-8 text-slate-600 sm:text-xl" variants={reveal}>
                Find a ride, meet your driver, and get to your destination. FareBid brings passengers and drivers together for smoother trips.
              </motion.p>
              <motion.div className="flex flex-wrap gap-3" variants={reveal}>
                <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-500 px-6 font-bold text-white transition hover:bg-emerald-600" to="/signup">
                  Ride with FareBid
                </Link>
                <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 font-bold text-slate-800 transition hover:border-slate-500" to="/signup">
                  Drive and earn
                </Link>
              </motion.div>
              <motion.div className="flex flex-wrap gap-x-8 gap-y-3 pt-2 text-sm text-slate-600" variants={reveal}>
                <span><strong className="mr-2 text-xl text-slate-950">2</strong> ways to ride</span>
                <span><strong className="mr-2 text-xl text-slate-950">1</strong> easy app</span>
                <span><strong className="mr-2 text-xl text-slate-950">24/7</strong> your schedule</span>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative mx-auto w-full max-w-lg"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="absolute inset-8 rounded-full bg-emerald-200/60 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">FareBid ride</p>
                    <p className="mt-1 text-xl font-bold">Your trip, in progress</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">Driver nearby</span>
                </div>
                <div className="my-6 rounded-2xl bg-slate-50 p-3 sm:p-5">
                  <RideRoute className="mx-auto max-h-56 text-emerald-500" />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Pickup</p>
                    <p className="font-semibold">Central Market</p>
                  </div>
                  <span className="self-center text-slate-400" aria-hidden="true">↓</span>
                  <div>
                    <p className="text-sm text-slate-500">Drop-off</p>
                    <p className="font-semibold">Riverside Station</p>
                  </div>
                  <p className="self-end text-right text-lg font-extrabold text-emerald-700">$18.40</p>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:-left-8">
                <p className="text-xs text-slate-500">Estimated pickup</p>
                <p className="font-bold">4 minutes</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24" id="roles">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">One platform, two ways to move</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">A ride-hailing app that works for everyone.</h2>
          </div>
          <motion.div
            className="grid gap-5 md:grid-cols-3"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {roles.map((role) => (
              <motion.article
                key={role.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-8"
                variants={reveal}
              >
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${role.badge}`}>{role.title}</span>
                <p className="mt-5 text-slate-600">{role.detail}</p>
                <ul className="mt-6 grid gap-3 border-t border-slate-100 pt-5 text-sm font-medium">
                  {role.bullets.map((bullet) => (
                    <li className="flex items-center gap-3" key={bullet}>
                      <span className="grid size-5 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700" aria-hidden="true">✓</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section className="bg-slate-50" id="how">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
            <div className="mb-10 max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Easy as 1, 2, 3</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">From here to there, made simple.</h2>
            </div>
            <ol className="grid gap-8 md:grid-cols-3">
              {steps.map(([number, title, detail]) => (
                <li className="border-t-2 border-slate-900 pt-5" key={number}>
                  <span className="text-sm font-extrabold text-emerald-700">{number}</span>
                  <h3 className="mt-3 text-xl font-bold">{title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-slate-950 text-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-400">Ready when you are</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Make your next move with FareBid.</h2>
              <p className="mt-3 text-slate-300">Sign up as a passenger or driver and get on your way.</p>
            </div>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-400 px-6 font-bold text-slate-950 transition hover:bg-emerald-300" to="/signup">
              Get started
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-7 sm:px-8">
          <Logo />
          <p className="text-sm text-slate-500">A simpler way to get there.</p>
        </div>
      </footer>
    </PageTransition>
  );
}
