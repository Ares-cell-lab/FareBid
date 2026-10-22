import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';

const envPath = './.env';
const content = fs.readFileSync(envPath, 'utf8');
const env = {};
content.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    env[match[1]] = (match[2] || '').trim();
  }
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function run() {
  const email = `driver_${Date.now()}@testfarebid.com`;
  const password = 'Password123!';
  console.log('Creating user:', email);

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created successfully:', cred.user.uid);

    const ref = doc(db, 'users', cred.user.uid);
    console.log('Attempting getDoc...');
    const snap = await getDoc(ref);
    console.log('getDoc result exists?', snap.exists());

    console.log('Attempting setDoc...');
    const newProfile = {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: 'Test Driver',
      role: 'driver',
      createdAt: serverTimestamp(),
    };
    await setDoc(ref, newProfile);
    console.log('setDoc SUCCEEDED!');
    process.exit(0);
  } catch (err) {
    console.error('FAILED with error:');
    console.error('Code:', err.code);
    console.error('Message:', err.message);
    process.exit(1);
  }
}

run();
