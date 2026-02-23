import { firebaseAuth } from "@/domain/auth/firebaseAuth.datasources";
import { auth } from "@/lib/firebase/firebaseApp";
import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  return firebaseAuth.onAuthStateChanged(() => cb());
}

function getSnapshot() {
  return auth.currentUser;
}

export function useFirebaseUser() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
