import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../fare-bidweb.js";
import { useAuth } from "../auth/AuthContext.jsx";
import PageTransition from "../components/PageTransition.jsx";
import Logo from "../components/Logo.jsx";
import {
  FiArrowLeft,
  FiShield,
  FiUsers,
  FiNavigation,
  FiAlertOctagon,
  FiCheckCircle,
  FiXCircle,
  FiSlash,
  FiStar,
  FiSearch,
  FiFilter,
  FiPhone,
  FiExternalLink,
  FiMapPin,
  FiFileText,
  FiActivity,
  FiTrendingUp,
} from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";

export default function AdminOps() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Active tab in Ops Hub
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "drivers" | "records" | "ratings" | "sos"

  // Data collections from Firestore
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Real-time listeners for users and rides
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubRides = onSnapshot(collection(db, "rides"), (snapshot) => {
      setRides(
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        })
      );
    });

    return () => {
      unsubUsers();
      unsubRides();
    };
  }, []);

  // Filtered collections
  const drivers = users.filter((u) => u.role === "driver");
  const passengers = users.filter((u) => u.role === "passenger");
  const onlineDrivers = drivers.filter((d) => d.isOnline);

  // Active SOS Alerts
  const activeSosRides = rides.filter((r) => r.emergencyAlert?.active);

  // Compute Total distance (km) driven across all drivers
  const totalKmDriven = drivers.reduce((acc, d) => acc + (d.totalDistanceKm || 0), 0) +
    rides.filter((r) => r.status === "completed").reduce((acc, r) => acc + (r.distanceKm || 0), 0);

  // Driver actions
  async function handleSetDriverStatus(driverId, newStatus) {
    try {
      await updateDoc(doc(db, "users", driverId), {
        driverStatus: newStatus,
        statusUpdatedAt: serverTimestamp(),
        // If banned/suspended, force offline
        ...(newStatus === "banned" || newStatus === "suspended" ? { isOnline: false } : {}),
      });
    } catch (err) {
      console.error("Error setting driver status:", err);
      alert("Failed to update driver status: " + err.message);
    }
  }

  // Clear / Resolve SOS alert
  async function handleResolveSOS(rideId) {
    try {
      await updateDoc(doc(db, "rides", rideId), {
        "emergencyAlert.active": false,
        "emergencyAlert.resolvedAt": serverTimestamp(),
      });
    } catch (err) {
      console.error("Error resolving SOS:", err);
    }
  }

  // Filtered drivers list
  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch =
      (d.displayName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.vehicle || "").toLowerCase().includes(searchQuery.toLowerCase());

    const driverStatus = d.driverStatus || "approved";
    const matchesFilter =
      statusFilter === "all" ||
      driverStatus === statusFilter ||
      (statusFilter === "online" && d.isOnline);

    return matchesSearch && matchesFilter;
  });

  return (
    <PageTransition className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <FiArrowLeft className="size-4" />
              <span>Admin Dashboard</span>
            </button>
            <Logo to="/admin" />
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold text-indigo-300">
              <FiShield className="size-4 text-indigo-400" />
              FareBid Operations Control Center
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8">
        {/* Urgent Live SOS Emergency Banner */}
        {activeSosRides.length > 0 && (
          <div className="mb-6 space-y-3">
            {activeSosRides.map((ride) => (
              <motion.div
                key={ride.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-rose-500 bg-linear-to-r from-rose-950/90 to-red-950/90 p-5 shadow-2xl shadow-rose-900/50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-rose-600 text-white animate-pulse">
                    <FiAlertOctagon className="size-7" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-extrabold uppercase text-white animate-bounce">
                        Active SOS Alert
                      </span>
                      <span className="text-xs text-rose-300">
                        Ride #{ride.id.slice(0, 8)}
                      </span>
                    </div>
                    <p className="mt-1 font-bold text-white text-base">
                      Passenger: {ride.emergencyAlert?.passengerName} · Phone: {ride.emergencyAlert?.passengerPhone}
                    </p>
                    <p className="text-xs text-rose-200">
                      Emergency Contact: {ride.emergencyAlert?.emergencyContact} | Driver: {ride.emergencyAlert?.driverName} ({ride.emergencyAlert?.vehicle})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {ride.emergencyAlert?.mapLink && (
                    <a
                      href={ride.emergencyAlert.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-slate-200"
                    >
                      <FiExternalLink className="size-4" />
                      <span>Track Live Location</span>
                    </a>
                  )}
                  <button
                    onClick={() => handleResolveSOS(ride.id)}
                    className="rounded-xl border border-rose-400 bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500"
                  >
                    Resolve Alert
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Ops Telemetry Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider">Total Driver Distance</span>
              <FiNavigation className="size-4 text-emerald-400" />
            </div>
            <p className="mt-2 font-sans text-3xl font-extrabold text-white">
              {totalKmDriven.toFixed(1)} <span className="text-base font-medium text-emerald-400">km</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">Recorded across all trip routes</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider">Registered Drivers</span>
              <FaCarSide className="size-4 text-amber-400" />
            </div>
            <p className="mt-2 font-sans text-3xl font-extrabold text-white">
              {drivers.length}
            </p>
            <p className="mt-1 text-xs text-amber-300">
              {onlineDrivers.length} active online right now
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider">Registered Passengers</span>
              <FiUsers className="size-4 text-sky-400" />
            </div>
            <p className="mt-2 font-sans text-3xl font-extrabold text-white">
              {passengers.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">FareBid accounts collection</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider">Total Trips Taken</span>
              <FiActivity className="size-4 text-indigo-400" />
            </div>
            <p className="mt-2 font-sans text-3xl font-extrabold text-white">
              {rides.length}
            </p>
            <p className="mt-1 text-xs text-emerald-400">
              {rides.filter((r) => r.status === "completed").length} completed successfully
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          {[
            { id: "drivers", label: `Driver Management (${drivers.length})`, icon: FaCarSide },
            { id: "records", label: `Trip Records & History (${rides.length})`, icon: FiFileText },
            { id: "ratings", label: "Driver Ratings & Reviews", icon: FiStar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-white text-slate-950 shadow-lg"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: DRIVERS MANAGEMENT (Accept/Decline Applications + Suspend/Ban) */}
        {activeTab === "drivers" && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
            {/* Search & Status Filter Bar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-64">
                <FiSearch className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search driver by name, email, vehicle..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {["all", "approved", "pending", "suspended", "banned"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-full px-3 py-1 font-semibold uppercase tracking-wider transition ${
                      statusFilter === st
                        ? "bg-indigo-500 text-white font-bold"
                        : "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Drivers Table / Card List */}
            <div className="space-y-3">
              {filteredDrivers.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">No drivers match filter.</p>
              ) : (
                filteredDrivers.map((driver) => {
                  const status = driver.driverStatus || "approved";
                  return (
                    <div
                      key={driver.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition hover:border-white/20"
                    >
                      <div className="flex items-center gap-3 min-w-48">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400">
                          <FaCarSide className="size-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{driver.displayName || "Driver"}</p>
                          <p className="text-xs text-slate-400">{driver.email}</p>
                          <p className="text-[11px] text-slate-400">{driver.vehicle || "Standard Vehicle"}</p>
                        </div>
                      </div>

                      {/* Distance & Rating Stats */}
                      <div className="flex items-center gap-6 text-xs">
                        <div>
                          <p className="text-slate-400">Distance Driven</p>
                          <p className="font-sans font-bold text-emerald-400">
                            {(driver.totalDistanceKm || 0).toFixed(1)} km
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Driver Rating</p>
                          <p className="font-sans font-bold text-amber-400">
                            ★ {driver.ratingAverage || 4.9} ({driver.ratingCount || 10})
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Online Radar</p>
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              driver.isOnline
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {driver.isOnline ? "ONLINE" : "OFFLINE"}
                          </span>
                        </div>
                      </div>

                      {/* Application & Discipline Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Badge */}
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                            status === "approved"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : status === "pending"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {status}
                        </span>

                        {/* Accept / Decline Application Buttons */}
                        {status === "pending" ? (
                          <>
                            <button
                              onClick={() => handleSetDriverStatus(driver.id, "approved")}
                              className="flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                            >
                              <FiCheckCircle className="size-3.5" />
                              <span>Accept Application</span>
                            </button>
                            <button
                              onClick={() => handleSetDriverStatus(driver.id, "declined")}
                              className="flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-500"
                            >
                              <FiXCircle className="size-3.5" />
                              <span>Decline</span>
                            </button>
                          </>
                        ) : (
                          /* Suspend & Ban / Unban controls */
                          <>
                            {status === "approved" ? (
                              <>
                                <button
                                  onClick={() => handleSetDriverStatus(driver.id, "suspended")}
                                  className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
                                >
                                  Suspend Driver
                                </button>
                                <button
                                  onClick={() => handleSetDriverStatus(driver.id, "banned")}
                                  className="flex items-center gap-1 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
                                >
                                  <FiSlash className="size-3.5" />
                                  <span>Ban</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleSetDriverStatus(driver.id, "approved")}
                                className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
                              >
                                Reactivate / Unban
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TRIP RECORDS & HISTORY */}
        {activeTab === "records" && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
            <h3 className="mb-4 font-sans text-xl font-bold text-white">
              Complete Driver Trip Ledger & Passenger Records
            </h3>

            {rides.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">No rides booked yet.</p>
            ) : (
              <div className="space-y-3">
                {rides.map((ride) => (
                  <div
                    key={ride.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">
                          Driver: {ride.driverName || "Unassigned"}
                        </span>
                        <span className="text-xs text-slate-500">·</span>
                        <span className="text-xs text-emerald-400">
                          Passenger: {ride.passengerName}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                        <FiMapPin className="size-3.5 text-emerald-400" />
                        <span>{ride.pickup?.name}</span>
                        <span>→</span>
                        <span>{ride.dropoff?.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs">
                      <div>
                        <p className="text-slate-400">Distance</p>
                        <p className="font-bold text-white">{ride.distanceKm} km</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Final Fare</p>
                        <p className="font-sans font-extrabold text-emerald-400 text-base">
                          ${(ride.finalFare || ride.offeredFare || 0).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                            ride.status === "completed"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : ride.status === "in_progress"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-white/10 text-slate-300"
                          }`}
                        >
                          {ride.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DRIVER RATINGS & REVIEWS */}
        {activeTab === "ratings" && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
            <h3 className="mb-4 font-sans text-xl font-bold text-white">
              Driver Ratings & Passenger Reviews
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {rides
                .filter((r) => r.rating)
                .map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">
                          Driver: {r.driverName || "Marcus Sterling"}
                        </p>
                        <p className="text-xs text-slate-400">Rated by {r.rating.passengerName}</p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: r.rating.stars || 5 }).map((_, i) => (
                          <FiStar key={i} className="size-4 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    {r.rating.tags && r.rating.tags.length > 0 && (
                      <div className="my-2.5 flex flex-wrap gap-1.5">
                        {r.rating.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {r.rating.comment && (
                      <p className="mt-2 text-xs italic text-slate-300">
                        "{r.rating.comment}"
                      </p>
                    )}

                    <p className="mt-3 text-[10px] text-slate-500">
                      Trip #{r.id.slice(0, 8)}: {r.pickup?.name} → {r.dropoff?.name}
                    </p>
                  </div>
                ))}
            </div>

            {rides.filter((r) => r.rating).length === 0 && (
              <p className="py-8 text-center text-xs text-slate-400">
                No passenger ratings submitted yet. Ratings appear here as soon as trips are completed.
              </p>
            )}
          </div>
        )}
      </main>
    </PageTransition>
  );
}
