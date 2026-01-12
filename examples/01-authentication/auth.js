// Firebase Authentication Example - Complete Implementation

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

// Firebase configuration (replace with your config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/**
 * Sign up with email and password
 */
export async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );

    console.log('✅ User created:', userCredential.user.uid);
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    console.error('❌ Sign up error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log('✅ Signed in:', userCredential.user.email);
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    console.error('❌ Sign in error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);

    console.log('✅ Google sign in:', result.user.displayName);
    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    console.error('❌ Google sign in error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Monitor auth state
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('👤 User signed in:', user.email);
      callback({ signedIn: true, user });
    } else {
      console.log('👤 User signed out');
      callback({ signedIn: false, user: null });
    }
  });
}

/**
 * Sign out
 */
export async function logout() {
  try {
    await signOut(auth);
    console.log('✅ Signed out successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Sign out error:', error.message);
    return { success: false, error: error.message };
  }
}

// Example usage
if (typeof window !== 'undefined') {
  // Monitor auth state
  onAuthChange((authState) => {
    if (authState.signedIn) {
      document.getElementById('user-info').textContent = 
        `Signed in as: ${authState.user.email}`;
    } else {
      document.getElementById('user-info').textContent = 'Not signed in';
    }
  });
}
