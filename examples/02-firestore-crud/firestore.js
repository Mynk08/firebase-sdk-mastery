// Firebase Firestore Example - CRUD Operations & Real-time

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';

// Initialize Firebase (use your config)
const firebaseConfig = { /* your config */ };
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/**
 * CREATE - Add a new document
 */
export async function addUser(userData) {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: serverTimestamp()
    });

    console.log('✅ Document written with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Error adding document:', error);
    return { success: false, error: error.message };
  }
}

/**
 * CREATE - Set document with custom ID
 */
export async function createUserProfile(userId, profileData) {
  try {
    await setDoc(doc(db, 'profiles', userId), {
      ...profileData,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Profile created for user:', userId);
    return { success: true };
  } catch (error) {
    console.error('❌ Error creating profile:', error);
    return { success: false, error: error.message };
  }
}

/**
 * READ - Get single document
 */
export async function getUser(userId) {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));

    if (docSnap.exists()) {
      console.log('✅ User data:', docSnap.data());
      return { success: true, data: docSnap.data() };
    } else {
      console.log('❌ No such document!');
      return { success: false, error: 'Document not found' };
    }
  } catch (error) {
    console.error('❌ Error getting document:', error);
    return { success: false, error: error.message };
  }
}

/**
 * READ - Get all documents in collection
 */
export async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));

    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    console.log(`✅ Found ${users.length} users`);
    return { success: true, data: users };
  } catch (error) {
    console.error('❌ Error getting documents:', error);
    return { success: false, error: error.message };
  }
}

/**
 * READ - Query with filters
 */
export async function getActiveUsers() {
  try {
    const q = query(
      collection(db, 'users'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`✅ Found ${users.length} active users`);
    return { success: true, data: users };
  } catch (error) {
    console.error('❌ Error querying documents:', error);
    return { success: false, error: error.message };
  }
}

/**
 * UPDATE - Update document fields
 */
export async function updateUser(userId, updates) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    console.log('✅ User updated:', userId);
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating document:', error);
    return { success: false, error: error.message };
  }
}

/**
 * DELETE - Remove document
 */
export async function deleteUser(userId) {
  try {
    await deleteDoc(doc(db, 'users', userId));

    console.log('✅ User deleted:', userId);
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting document:', error);
    return { success: false, error: error.message };
  }
}

/**
 * REAL-TIME - Listen to changes
 */
export function listenToUsers(callback) {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`🔄 Real-time update: ${users.length} users`);
    callback(users);
  });
}

/**
 * REAL-TIME - Listen to single document
 */
export function listenToUser(userId, callback) {
  const userRef = doc(db, 'users', userId);

  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      console.log('🔄 User updated:', doc.data());
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  });
}

// Example usage in React component
/*
import { useState, useEffect } from 'react';
import { listenToUsers } from './firestore';

function UsersComponent() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToUsers(setUsers);
    return () => unsubscribe(); // Cleanup
  }, []);

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
*/
