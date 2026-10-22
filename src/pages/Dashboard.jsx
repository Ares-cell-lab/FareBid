import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../fare-bidweb.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { friendlyError } from "../auth/authErrors.js";
import { normalizeRole, ROLE_LABEL } from "../auth/roles.js";
import PageTransition from "../components/PageTransition.jsx";
import Logo from "../components/Logo.jsx";
import StickyRoleButton from "../components/StickyRoleButton.jsx";

const ROLE_BADGES = {
  admin: "bg-violet-100 text-violet-800",
  driver: "bg-amber-100 text-amber-800",
  passenger: "bg-sky-100 text-sky-800",
};

const CONTENT = {
  driver: {
    heading: "Your next fare is just around the corner.",
    stats: [
      { label: "Rides today", value: "8" },
      { label: "Today's earnings", value: "$146.50" },
      { label: "Driver rating", value: "4.9 / 5" },
    ],
    listTitle: "Recent rides",
    list: [
      { main: "Jordan Lee", sub: "Airport pickup → Downtown", side: "$28.50" },
      { main: "Sam Taylor", sub: "Riverside → Central Station", side: "$16.00" },
      { main: "Casey Morgan", sub: "North Park → Market Square", side: "$12.75" },
      { main: "Riley Chen", sub: "City Centre → Westside", side: "$21.25" },
    ],
  },
  passenger: {
    heading: "Where to next? Your ride is a tap away.",
    stats: [
      { label: "Next pickup", value: "10:30 AM" },
      { label: "Rides this month", value: "6" },
      { label: "Saved places", value: "3" },
    ],
    listTitle: "Recent trips",
    list: [
      { main: "Home → City Centre", sub: "Today · Driver: Alex", side: "$14.20" },
      { main: "Airport → Home", sub: "Mon · Driver: Jamie", side: "$32.80" },
      { main: "Office → Riverside", sub: "Fri · Driver: Morgan", side: "$18.40" },
      { main: "Market Square → Home", sub: "Wed · Driver: Taylor", side: "$11.60" },
    ],
  },
};

const group = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function Dashboard({ role }) {
  const { user, profile, logOut } = useAuth();
  const navigate = useNavigate();
  const firstName = role === "admin"
    ? "Admin"
    : (profile?.displayName || user?.email || "").split(" ")[0];
  const [sosAlertCount, setSosAlertCount] = useState(0);

  useEffect(() => {
    if (role !== "admin") return;
    const unsub = onSnapshot(collection(db, "rides"), (snapshot) => {
      const activeSos = snapshot.docs.filter((d) => d.data().emergencyAlert?.active);
      setSosAlertCount(activeSos.length);
    });
    return () => unsub();
  }, [role]);

  async function handleSignOut() {
    await logOut();
    navigate("/");
  }

  return (
    <PageTransition className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-18 w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Logo to="/" />
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${ROLE_BADGES[role] || "bg-slate-100 text-slate-700"}`}>
              {ROLE_LABEL[role] || "User"}
            </span>
            <span className="max-w-56 break-all text-sm text-slate-500">
              {role === "admin" ? "Admin" : user?.email}
            </span>
            <button
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:border-slate-900 hover:bg-slate-50"
              type="button"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-4 px-5 py-10 sm:px-8 sm:py-14">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
          {ROLE_LABEL[role]} dashboard
        </p>
        <h1 className="font-sans text-4xl font-extrabold tracking-tight sm:text-5xl">
          {role === "admin" ? "Welcome, Admin." : `Hi, ${firstName}.`}
        </h1>
        {role === "admin" ? <AdminView /> : <ExampleView content={CONTENT[role]} />}
      </main>

      {/* Floating Sticky Button on the bottom-right */}
      <StickyRoleButton role={role} alertCount={sosAlertCount} />
    </PageTransition>
  );
}

function ExampleView({ content }) {
  return (
    <>
      <p className="max-w-2xl text-lg text-slate-600">{content.heading}</p>
      <motion.div className="mt-4 grid gap-4 sm:grid-cols-3" variants={group} initial="hidden" animate="show">
        {content.stats.map((stat) => (
          <motion.div key={stat.label} className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" variants={rise}>
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="font-sans text-2xl font-bold tabular-nums">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white px-5 pb-3 pt-2 shadow-sm">
        <div className="flex items-center justify-between gap-3 py-4">
          <h2 className="font-sans text-xl font-bold">{content.listTitle}</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Sample activity</span>
        </div>
        <motion.ul className="m-0 list-none p-0" variants={group} initial="hidden" animate="show">
          {content.list.map((row) => (
            <motion.li key={row.main + row.sub} className="flex items-center justify-between gap-4 border-t border-slate-100 py-4" variants={rise}>
              <div className="min-w-0">
                <p className="font-semibold">{row.main}</p>
                <p className="wrap-break-word text-sm text-slate-500">{row.sub}</p>
              </div>
              <span className="whitespace-nowrap font-semibold tabular-nums">{row.side}</span>
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </>
  );
}

function AdminView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDocs(collection(db, "users"))
      .then((snapshot) => setUsers(snapshot.docs.map((document) => document.data())))
      .catch((err) => setError(friendlyError(err)))
      .finally(() => setLoading(false));
  }, []);

  const count = (role) => users.filter((account) => normalizeRole(account.role) === role).length;
  const stats = [
    { label: "All accounts", value: users.length },
    { label: "Drivers", value: count("driver") },
    { label: "Passengers", value: count("passenger") },
  ];

  return (
    <>
      <p className="max-w-2xl text-lg text-slate-600">A quick look at everyone using the FareBid ride-hailing platform.</p>
      <motion.div className="mt-4 grid gap-4 sm:grid-cols-3" variants={group} initial="hidden" animate="show">
        {stats.map((stat) => (
          <motion.div key={stat.label} className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" variants={rise}>
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="font-sans text-2xl font-bold tabular-nums">{loading ? "–" : stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white px-5 pb-3 pt-2 shadow-sm">
        <div className="flex items-center justify-between gap-3 py-4">
          <h2 className="font-sans text-xl font-bold">FareBid accounts</h2>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" /> Live from Firestore
          </span>
        </div>
        {error && <p className="my-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {loading && <p className="py-3 text-slate-500">Loading accounts…</p>}
        {!loading && !error && users.length === 0 && <p className="py-3 text-slate-500">No accounts yet.</p>}
        <motion.ul className="m-0 list-none p-0" variants={group} initial="hidden" animate="show" key={users.length}>
          {users.map((account) => {
            const role = normalizeRole(account.role);
            return (
              <motion.li key={account.uid} className="flex items-center justify-between gap-4 border-t border-slate-100 py-4" variants={rise}>
                <div className="min-w-0">
                  <p className="font-semibold">{account.displayName || "No name"}</p>
                  <p className="break-all text-sm text-slate-500">{account.email}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${ROLE_BADGES[role] || "bg-slate-100 text-slate-700"}`}>
                  {ROLE_LABEL[role] || "Unknown"}
                </span>
              </motion.li>
            );
          })}
        </motion.ul>
      </section>
    </>
  );
}
