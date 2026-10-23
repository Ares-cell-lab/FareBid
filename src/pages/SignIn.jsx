import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../auth/AuthContext.jsx";
import { friendlyError } from "../auth/authErrors.js";
import { ROLE_HOME } from "../auth/roles.js";
import AuthShell from "../components/AuthShell.jsx";
import { ErrorMessage, Field, GoogleButton, SubmitButton } from "../components/FormBits.jsx";

export default function SignIn() {
  const { user, role, authError, signIn, signInWithGoogle, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Step 4: already signed in? Go straight to the right dashboard.
  if (user && role) {
    return <Navigate to={ROLE_HOME[role]} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page
    setError("");
    setBusy(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();
    setError("");
    setResetSent(false);
    if (!email.trim()) {
      setError("Please enter your account email address.");
      return;
    }
    setBusy(true);
    try {
      await resetPassword(email.trim());
      setResetSent(true);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  if (showForgotPassword) {
    return (
      <AuthShell
        title="Reset your password"
        subtitle="Enter the email associated with your account, and we'll send you a password reset link."
      >
        <ErrorMessage message={error || authError} />

        {resetSent ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
            <div className="flex items-center gap-2 font-semibold">
              <FiCheckCircle className="size-5 text-emerald-600" />
              <span>Password reset link sent!</span>
            </div>
            <p className="mt-1 text-xs text-emerald-700">
              We sent a reset link to <strong>{email.trim()}</strong>. Check your inbox (and spam folder) and follow the instructions to set a new password.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setResetSent(false);
                setError("");
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950"
            >
              <FiArrowLeft className="size-3.5" />
              <span>Back to sign in</span>
            </button>
          </div>
        ) : (
          <form className="mt-5 grid gap-4" onSubmit={handleResetPassword}>
            <Field
              id="reset-email"
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <SubmitButton busy={busy}>Send reset link</SubmitButton>

            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setError("");
              }}
              className="mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              <FiArrowLeft className="size-4" />
              <span>Back to sign in</span>
            </button>
          </form>
        )}
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to open your dashboard.">
      <ErrorMessage message={error || authError} />

      <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
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
        <div>
          <Field
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="mt-1.5 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(true);
                setError("");
                setResetSent(false);
              }}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition"
            >
              Forgot password?
            </button>
          </div>
        </div>
        <SubmitButton busy={busy && !authError}>Sign in</SubmitButton>
      </form>

      <div className="my-5 flex items-center gap-3 text-sm text-slate-500 before:h-px before:flex-1 before:bg-slate-200 before:content-[''] after:h-px after:flex-1 after:bg-slate-200 after:content-['']"><span>or</span></div>
      <GoogleButton onClick={handleGoogle} disabled={busy && !authError} />

      <p className="mt-5 text-center text-sm text-slate-600">
        New to FareBid? <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to="/signup">Create an account</Link>
      </p>
    </AuthShell>
  );
}
