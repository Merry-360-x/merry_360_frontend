import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

let app, auth, db, storage

export function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  }
  return { app, auth, db, storage }
}

export const firebaseAuth = () => auth || initFirebase().auth
export const firebaseDB = () => db || initFirebase().db
export const firebaseStorage = () => storage || initFirebase().storage

/* Authentication helpers */
export async function signUpWithEmail(email, password) {
  await initFirebase()
  return await createUserWithEmailAndPassword(auth, email, password)
}

export async function signInWithEmail(email, password) {
  await initFirebase()
  return await signInWithEmailAndPassword(auth, email, password)
}

export async function googleSignIn() {
  await initFirebase()
  const provider = new GoogleAuthProvider()
  return await signInWithPopup(auth, provider)
}

export async function signOutUser() {
  await initFirebase()
  return await signOut(auth)
}

export function onAuthChange(cb) {
  initFirebase()
  return onAuthStateChanged(auth, cb)
}

/* Firestore helpers */
export async function createMessage(conversationId, message) {
  const db = firebaseDB()
  const messagesRef = collection(db, 'conversations', conversationId, 'messages')
  const docRef = await addDoc(messagesRef, {
    ...message,
    createdAt: new Date().toISOString()
  })
  return docRef
}

export function listenToMessages(conversationId, cb) {
  const db = firebaseDB()
  const messagesRef = collection(db, 'conversations', conversationId, 'messages')
  const q = query(messagesRef, orderBy('createdAt', 'asc'))
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
    cb(messages)
  })
}

export async function uploadFileToStorage(path, file) {
  const storage = firebaseStorage()
  const ref = storageRef(storage, path)
  const snapshot = await uploadBytes(ref, file)
  const url = await getDownloadURL(snapshot.ref)
  return url
}

export async function setUserProfile(uid, data) {
  const db = firebaseDB()
  const userRef = doc(db, 'users', uid)
  await setDoc(userRef, data, { merge: true })
  return true
}

export async function getUserProfile(uid) {
  const db = firebaseDB()
  const userRef = doc(db, 'users', uid)
  const snap = await getDoc(userRef)
  return snap.exists() ? snap.data() : null
}

export default {
  initFirebase,
  signUpWithEmail,
  signInWithEmail,
  googleSignIn,
  signOutUser,
  onAuthChange,
  createMessage,
  listenToMessages,
  uploadFileToStorage,
  setUserProfile,
  getUserProfile
}
