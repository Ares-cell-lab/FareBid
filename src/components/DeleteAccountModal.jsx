import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiAlertTriangle, FiTrash2, FiX, FiLock } from "react-icons/fi";
import { useAuth } from "../auth/AuthContext.jsx";
import { friendlyError } from "../auth/authErrors.js";

export default function DeleteAccountModal({ isOpen, onClose, onDeleted, userRole = "user" }) {
  const { user, deleteAccount } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const isPasswordProvider = user?.providerData?.some(
    (p) => p.providerId === "password"
  );

  async function handleDelete(e) {
    e.preventDefault();
    setError("");

    if (confirmText.trim().toUpperCase() !== "DELETE") {
      setError("Please type DELETE to confirm.");
      return;
    }

    if (isPasswordProvider && !password) {
      setError("Please enter your current password to authorize deletion.");
      return;
    }

    setBusy(true);
    try {
      await deleteAccount(password);
      if (onDeleted) {
        onDeleted();
      }
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  }

  const roleTitle =
    userRole === "admin"
      ? "Admin"
      : userRole === "passenger"
      ? "Passenger"
      : "User";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg rounded-3xl border border-rose-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900"
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            aria-label="Close dialog"
          >
            <FiX className="size-5" />
          </button>

          {/* Warning Icon & Heading */}
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <FiAlertTriangle className="size-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Delete {roleTitle} Account
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                This will permanently delete your account and erase your profile.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-rose-50 border border-rose-100 p-4 text-xs text-rose-800 space-y-1.5">
            <p className="font-bold text-rose-900">Important notices before proceeding:</p>
            <ul className="list-disc list-inside space-y-1 text-rose-700">
              <li>Your login credentials and account will be deleted permanently.</li>
              <li>Your profile information and platform preferences will be wiped.</li>
              <li>You will be signed out immediately and cannot undo this action.</li>
            </ul>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-700" role="alert">
              {error}
            </p>
          )}

          <form onSubmit={handleDelete} className="mt-5 space-y-4">
            {isPasswordProvider && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="confirm-delete-password">
                  Confirm your password:
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <input
                    id="confirm-delete-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-3 focus:ring-rose-100"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="type-delete-confirm">
                Type <span className="font-mono font-black text-rose-600">DELETE</span> to confirm:
              </label>
              <input
                id="type-delete-confirm"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-3 focus:ring-rose-100"
                required
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy || confirmText.trim().toUpperCase() !== "DELETE"}
                className="flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50 shadow-md shadow-rose-200"
              >
                <FiTrash2 className="size-4" />
                <span>{busy ? "Deleting account…" : "Permanently delete account"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
