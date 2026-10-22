import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import fs from 'fs';

// Read env
const envContent = fs.readFileSync('./.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) env[match[1]] = (match[2] || '').trim();
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

const results = [];

async function assertAllowed(description, promiseFn) {
  try {
    await promiseFn();
    results.push({ description, passed: true, detail: 'Allowed as expected' });
    console.log(` ${colors.green}PASS${colors.reset} ${description}`);
  } catch (err) {
    results.push({ description, passed: false, detail: `Unexpected denial: ${err.code || err.message}` });
    console.log(` ${colors.red}FAIL${colors.reset} ${description} -> ${err.code || err.message}`);
  }
}

async function assertDenied(description, promiseFn) {
  try {
    await promiseFn();
    results.push({ description, passed: false, detail: 'Operation succeeded but was expected to be DENIED' });
    console.log(` ${colors.red}FAIL${colors.reset} ${description} -> Allowed unexpectedly!`);
  } catch (err) {
    const code = err.code || '';
    if (code.includes('permission-denied') || code.includes('PERMISSION_DENIED') || err.message.includes('permission')) {
      results.push({ description, passed: true, detail: `Denied with ${code || 'permission-denied'}` });
      console.log(` ${colors.green}PASS${colors.reset} ${description}`);
    } else {
      results.push({ description, passed: false, detail: `Failed with non-permission error: ${code || err.message}` });
      console.log(` ${colors.yellow}WARN${colors.reset} ${description} -> other error: ${code || err.message}`);
    }
  }
}

async function runTestSuite() {
  console.log(`\n${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}   FIRESTORE SECURITY RULES COMPREHENSIVE TEST SUITE  ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}\n`);
  console.log(`Target Firebase Project: ${colors.yellow}${firebaseConfig.projectId}${colors.reset}\n`);

  const timestamp = Date.now();
  const emailA = `driver_${timestamp}@testfarebid.com`;
  const emailB = `passenger_${timestamp}@testfarebid.com`;
  const password = 'TestPassword123!';

  // Initialize isolated apps
  const appUnauth = initializeApp(firebaseConfig, `unauth_${timestamp}`);
  const dbUnauth = getFirestore(appUnauth);

  const appA = initializeApp(firebaseConfig, `userA_${timestamp}`);
  const authA = getAuth(appA);
  const dbA = getFirestore(appA);

  const appB = initializeApp(firebaseConfig, `userB_${timestamp}`);
  const authB = getAuth(appB);
  const dbB = getFirestore(appB);

  console.log(`${colors.bold}[1/6] Provisioning Test Identities...${colors.reset}`);
  const credA = await createUserWithEmailAndPassword(authA, emailA, password);
  console.log(`  Created User A (Driver): ${credA.user.uid} (${emailA})`);

  const credB = await createUserWithEmailAndPassword(authB, emailB, password);
  console.log(`  Created User B (Passenger): ${credB.user.uid} (${emailB})`);

  const uidA = credA.user.uid;
  const uidB = credB.user.uid;

  // -------------------------------------------------------------
  // SUITE 1: UNAUTHENTICATED ACCESS
  // -------------------------------------------------------------
  console.log(`\n${colors.bold}[2/6] Suite 1: Unauthenticated Client Restrictions${colors.reset}`);

  await assertDenied(
    'Unauthenticated user cannot read a user profile',
    () => getDoc(doc(dbUnauth, 'users', uidA))
  );

  await assertDenied(
    'Unauthenticated user cannot list /users collection',
    () => getDocs(collection(dbUnauth, 'users'))
  );

  await assertDenied(
    'Unauthenticated user cannot create a user document',
    () => setDoc(doc(dbUnauth, 'users', 'random_id'), {
      uid: 'random_id',
      email: 'anon@test.com',
      displayName: 'Anon',
      role: 'passenger',
      createdAt: serverTimestamp()
    })
  );

  await assertDenied(
    'Unauthenticated user cannot update a user document',
    () => updateDoc(doc(dbUnauth, 'users', uidA), { displayName: 'Hacked' })
  );

  await assertDenied(
    'Unauthenticated user cannot delete a user document',
    () => deleteDoc(doc(dbUnauth, 'users', uidA))
  );

  await assertDenied(
    'Unauthenticated user cannot access arbitrary collections (/rides)',
    () => getDoc(doc(dbUnauth, 'rides', 'ride_123'))
  );

  // -------------------------------------------------------------
  // SUITE 2: USER PROFILE CREATION SCHEMA VALIDATION
  // -------------------------------------------------------------
  console.log(`\n${colors.bold}[3/6] Suite 2: Profile Creation & Schema Integrity (User A)${colors.reset}`);

  await assertDenied(
    'User A cannot create profile for another user ID',
    () => setDoc(doc(dbA, 'users', uidB), {
      uid: uidB,
      email: emailA,
      displayName: 'Driver A',
      role: 'driver',
      createdAt: serverTimestamp()
    })
  );

  await assertDenied(
    'User A cannot spoof email (payload email != auth.token.email)',
    () => setDoc(doc(dbA, 'users', uidA), {
      uid: uidA,
      email: 'spoofed@farebid.com',
      displayName: 'Driver A',
      role: 'driver',
      createdAt: serverTimestamp()
    })
  );

  await assertDenied(
    'User A cannot self-assign role "admin"',
    () => setDoc(doc(dbA, 'users', uidA), {
      uid: uidA,
      email: emailA,
      displayName: 'Driver A',
      role: 'admin',
      createdAt: serverTimestamp()
    })
  );

  await assertDenied(
    'User A cannot use invalid role "superman"',
    () => setDoc(doc(dbA, 'users', uidA), {
      uid: uidA,
      email: emailA,
      displayName: 'Driver A',
      role: 'superman',
      createdAt: serverTimestamp()
    })
  );

  await assertDenied(
    'User A cannot include extra unauthorized fields (e.g., "balance")',
    () => setDoc(doc(dbA, 'users', uidA), {
      uid: uidA,
      email: emailA,
      displayName: 'Driver A',
      role: 'driver',
      createdAt: serverTimestamp(),
      balance: 1000
    })
  );

  await assertDenied(
    'User A cannot omit required fields (e.g., missing "role")',
    () => setDoc(doc(dbA, 'users', uidA), {
      uid: uidA,
      email: emailA,
      displayName: 'Driver A',
      createdAt: serverTimestamp()
    })
  );

  await assertDenied(
    'User A cannot provide non-string displayName',
    () => setDoc(doc(dbA, 'users', uidA), {
      uid: uidA,
      email: emailA,
      displayName: 123456,
      role: 'driver',
      createdAt: serverTimestamp()
    })
  );

  await assertDenied(
    'User A cannot provide displayName exceeding 100 characters',
    () => setDoc(doc(dbA, 'users', uidA), {
      uid: uidA,
      email: emailA,
      displayName: 'A'.repeat(101),
      role: 'driver',
      createdAt: serverTimestamp()
    })
  );

  await assertDenied(
    'User A cannot forge createdAt timestamp (must be serverTimestamp() / request.time)',
    () => setDoc(doc(dbA, 'users', uidA), {
      uid: uidA,
      email: emailA,
      displayName: 'Driver A',
      role: 'driver',
      createdAt: Timestamp.fromDate(new Date('2020-01-01'))
    })
  );

  await assertAllowed(
    'User A CAN create their own valid driver profile',
    () => setDoc(doc(dbA, 'users', uidA), {
      uid: uidA,
      email: emailA,
      displayName: 'Driver Alex',
      role: 'driver',
      createdAt: serverTimestamp()
    })
  );

  await assertAllowed(
    'User B CAN create their own valid passenger profile',
    () => setDoc(doc(dbB, 'users', uidB), {
      uid: uidB,
      email: emailB,
      displayName: 'Passenger Sam',
      role: 'passenger',
      createdAt: serverTimestamp()
    })
  );

  // -------------------------------------------------------------
  // SUITE 3: READ PERMISSIONS (ISOLATION)
  // -------------------------------------------------------------
  console.log(`\n${colors.bold}[4/6] Suite 3: Read Permissions & Tenant Isolation${colors.reset}`);

  await assertAllowed(
    'User A can read their own profile (/users/{uidA})',
    () => getDoc(doc(dbA, 'users', uidA))
  );

  await assertDenied(
    'User A CANNOT read User B\'s profile (/users/{uidB})',
    () => getDoc(doc(dbA, 'users', uidB))
  );

  await assertAllowed(
    'User B can read their own profile (/users/{uidB})',
    () => getDoc(doc(dbB, 'users', uidB))
  );

  await assertDenied(
    'User B CANNOT read User A\'s profile (/users/{uidA})',
    () => getDoc(doc(dbB, 'users', uidA))
  );

  await assertDenied(
    'User A CANNOT list the /users collection',
    () => getDocs(collection(dbA, 'users'))
  );

  await assertDenied(
    'User B CANNOT list the /users collection',
    () => getDocs(collection(dbB, 'users'))
  );

  // -------------------------------------------------------------
  // SUITE 4: UPDATE PERMISSIONS (IMMUTABILITY & FIELD RESTRICTIONS)
  // -------------------------------------------------------------
  console.log(`\n${colors.bold}[5/6] Suite 4: Document Updates & Immutability${colors.reset}`);

  await assertAllowed(
    'User A can update their own displayName',
    () => updateDoc(doc(dbA, 'users', uidA), {
      displayName: 'Alex Smith'
    })
  );

  await assertDenied(
    'User A cannot update displayName to non-string',
    () => updateDoc(doc(dbA, 'users', uidA), {
      displayName: 9999
    })
  );

  await assertDenied(
    'User A cannot update displayName to length > 100',
    () => updateDoc(doc(dbA, 'users', uidA), {
      displayName: 'A'.repeat(101)
    })
  );

  await assertDenied(
    'User A cannot change their own role (driver -> admin)',
    () => updateDoc(doc(dbA, 'users', uidA), {
      role: 'admin'
    })
  );

  await assertDenied(
    'User A cannot change their own email',
    () => updateDoc(doc(dbA, 'users', uidA), {
      email: 'newemail@test.com'
    })
  );

  await assertDenied(
    'User A cannot add new fields during update (e.g., isVerified)',
    () => updateDoc(doc(dbA, 'users', uidA), {
      displayName: 'Alex',
      isVerified: true
    })
  );

  await assertDenied(
    'User A cannot update User B\'s document',
    () => updateDoc(doc(dbA, 'users', uidB), {
      displayName: 'Hacked by A'
    })
  );

  // -------------------------------------------------------------
  // SUITE 5: DELETION & CATCH-ALL RESTRICTIONS
  // -------------------------------------------------------------
  console.log(`\n${colors.bold}[6/6] Suite 5: Deletion & Default Deny Catch-All${colors.reset}`);

  await assertDenied(
    'User A CANNOT delete their own document (admin-only)',
    () => deleteDoc(doc(dbA, 'users', uidA))
  );

  await assertDenied(
    'User A CANNOT delete User B\'s document',
    () => deleteDoc(doc(dbA, 'users', uidB))
  );

  await assertDenied(
    'Authenticated user CANNOT read from unconfigured collections (/unconfigured_vault)',
    () => getDoc(doc(dbA, 'unconfigured_vault', 'doc_001'))
  );

  await assertDenied(
    'Authenticated user CANNOT write to unconfigured collections (/unconfigured_vault)',
    () => setDoc(doc(dbA, 'unconfigured_vault', 'doc_001'), { secret: true })
  );

  // -------------------------------------------------------------
  // SUMMARY REPORT
  // -------------------------------------------------------------
  console.log(`\n${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}                     SUMMARY REPORT                   ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}\n`);

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;

  console.log(`Total Rules Tests: ${results.length}`);
  console.log(`${colors.green}Passed: ${passedCount}${colors.reset}`);
  if (failedCount > 0) {
    console.log(`${colors.red}Failed: ${failedCount}${colors.reset}`);
  } else {
    console.log(`${colors.bold}${colors.green}ALL TESTS PASSED! Your firestore.rules are working perfectly!${colors.reset}`);
  }

  process.exit(failedCount > 0 ? 1 : 0);
}

runTestSuite().catch(err => {
  console.error('Test Suite encountered fatal error:', err);
  process.exit(1);
});
