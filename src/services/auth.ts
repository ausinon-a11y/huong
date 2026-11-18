import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Google Workspace Scopes
export const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
];

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Verify Firestore connectivity on startup without blocking UI
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration: Firestore client is offline.');
    }
  }
}
void testFirestoreConnection();

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

// Memory-only Google Workspace access token storage (for Google Sheets API)
let cachedAccessToken: string | null = null;

export const getCachedAccessToken = () => cachedAccessToken;

export const getCurrentIdToken = async (forceRefresh = false): Promise<string> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại tài khoản Google quản trị.');
  }
  return user.getIdToken(forceRefresh);
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken || '');
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Không thể nhận access token từ Google');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: credential.accessToken };
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export const signOut = async () => {
  cachedAccessToken = null;
  await firebaseSignOut(auth);
};
