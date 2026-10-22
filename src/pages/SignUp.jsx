// SignUp.jsx
//
// What's special here:
//   - The user picks a role: Passenger or Driver.
//   - If they type an ADMIN email, the role picker disappears and a badge
//     says "Admin email recognised". Admin can never be picked by hand.
//   - The sliding highlight behind the chosen role uses `layoutId`:
//     motion sees the same layoutId in a new place and animates it there.
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "../auth/AuthContext.jsx";
import { friendlyError } from "../auth/authErrors.js";
import { isAdminEmail, ROLE_HOME } from "../auth/roles.js";
import AuthShell from "../components/AuthShell.jsx";
import { ErrorMessage, Field, GoogleButton, SubmitButton } from "../components/FormBits.jsx";

const ROLE_OPTIONS = [
  { value: "passenger", title: "Passenger", text: "Request rides and track trips" },
  { value: "driver", title: "Driver", text: "Accept rides and earn fares" },
];

export default function SignUp() {
  const { user, role, authError, signUp, signInWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("passenger");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // This updates on every key press, so the badge appears while typing.
  const adminDetected = isAdminEmail(email);

  if (user && role) {
    return <Navigate to={ROLE_HOME[role]} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
        role: selectedRole,
      });
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setBusy(true);
    try {
      await signInWithGoogle(selectedRole);
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="It takes less than a minute.">
      <ErrorMessage message={error || authError} />

      <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
        <Field
          id="name"
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Alex Morgan"
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Field
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Show EITHER the admin badge OR the role picker */}
        <AnimatePresence mode="wait" initial={false}>
          {adminDetected ? (
            <motion.div
              key="admin"
              className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-800"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">Admin</span>
              <span>Admin email recognised. You'll get the admin dashboard.</span>
            </motion.div>
          ) : (
            <motion.fieldset
              key="picker"
              className="m-0 min-w-0 border-0 p-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <legend className="mb-2 text-sm font-semibold text-slate-700">I want to join FareBid as a</legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup">
                {ROLE_OPTIONS.map((option) => {
                  const isChosen = selectedRole === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isChosen}
                      className={`relative grid gap-1 rounded-2xl border p-4 text-left transition ${isChosen ? "border-emerald-500 bg-emerald-50 text-slate-950 ring-2 ring-emerald-100" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"}`}
                      onClick={() => setSelectedRole(option.value)}
                    >
                      {isChosen && (
                        <motion.span
                          layoutId="role-highlight"
                          className="pointer-events-none absolute inset-0 rounded-2xl bg-emerald-50"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="relative font-bold">{option.title}</span>
                      <span className="relative text-sm">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </motion.fieldset>
          )}
        </AnimatePresence>

        <SubmitButton busy={busy && !authError}>Create account</SubmitButton>
      </form>

      <div className="my-5 flex items-center gap-3 text-sm text-slate-500 before:h-px before:flex-1 before:bg-slate-200 before:content-[''] after:h-px after:flex-1 after:bg-slate-200 after:content-['']"><span>or</span></div>
      <GoogleButton onClick={handleGoogle} disabled={busy && !authError} />

      <p className="mt-5 text-center text-sm text-slate-600">
        Already have an account? <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to="/signin">Sign in</Link>
      </p>
    </AuthShell>
  );
}
