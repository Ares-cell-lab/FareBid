// Small pieces both forms use, so SignIn and SignUp stay short.
import { AnimatePresence, motion } from "motion/react";

export function Field({ id, label, ...inputProps }) {
  return (
    <label className="grid gap-1.5" htmlFor={id}>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        id={id}
        name={id}
        className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        {...inputProps}
      />
    </label>
  );
}

// The error box slides open when there is a message and closes when it's gone.
// AnimatePresence is needed so the box can animate OUT before it is removed.
export function ErrorMessage({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          className="mt-3 overflow-hidden rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function GoogleButton({ onClick, disabled }) {
  return (
    <button className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-5 font-semibold text-slate-800 transition hover:border-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={onClick} disabled={disabled}>
      <svg className="size-[18px]" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7z" />
        <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
        <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8z" />
        <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.8 3.6-4.9 6.7-4.9z" />
      </svg>
      Continue with Google
    </button>
  );
}

// A button that gently shrinks when pressed.
export function SubmitButton({ busy, children }) {
  return (
    <motion.button
      className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-emerald-500 px-5 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
      type="submit"
      disabled={busy}
      whileTap={{ scale: 0.97 }}
    >
      {busy ? "Please wait…" : children}
    </motion.button>
  );
}
