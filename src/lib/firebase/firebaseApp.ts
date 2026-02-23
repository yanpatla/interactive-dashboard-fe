import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

const useEmulator =
  import.meta.env.DEV &&
  (import.meta.env.VITE_USE_AUTH_EMULATOR as string) === "true";

if (useEmulator) {
  const url = import.meta.env.VITE_AUTH_EMULATOR_URL as string;
  connectAuthEmulator(auth, url, { disableWarnings: true });
}
