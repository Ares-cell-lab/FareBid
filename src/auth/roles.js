// roles.js - everything about roles lives in this one small file.
//
// There are three roles: "admin", "driver" and "passenger".
//
// HOW EACH ROLE IS DECIDED
//   admin   -> nobody can choose it. If your email is in ADMIN_EMAILS below,
//              the app recognises you as admin automatically.
//   driver  -> chosen on the sign-up form.
//   passenger -> chosen on the sign-up form (also the default, e.g. Google).
//
// IMPORTANT: this list is also written in firestore.rules. The code here
// decides what the user *sees*; the rules decide what the database *allows*.
// If you change one list, change the other one too.

export const ADMIN_EMAILS = ["admin@farebid.com"];

export function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

// Where each role goes after signing in.
export const ROLE_HOME = {
  admin: "/admin",
  driver: "/driver",
  passenger: "/passenger",
};

export const ROLE_LABEL = {
  admin: "Administrator",
  driver: "Driver",
  passenger: "Passenger",
};

export function normalizeRole(role) {
  if (role === "doctor") return "driver";
  if (role === "patient") return "passenger";
  return ["admin", "driver", "passenger"].includes(role) ? role : null;
}
