import { auth } from "@/lib/firebase/firebaseApp";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";

export const firebaseAuth = {
  onAuthStateChanged(cb: (u: User | null) => void) {
    return onAuthStateChanged(auth, cb);
  },
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  },
  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  },
  loginWithGooglePopup() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  },
  logout() {
    return signOut(auth);
  },
};
