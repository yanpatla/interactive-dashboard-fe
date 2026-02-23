import { auth } from "@/lib/firebase/firebaseApp";
import { useMutation } from "@tanstack/react-query";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";

function buildGoogleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}
export function useGoogleLogin() {
  return useMutation({
    mutationFn: async () => {
      const provider = buildGoogleProvider();

      try {
        const cred = await signInWithPopup(auth, provider);
        return cred.user;
      } catch (e: unknown) {
        const code = (e as { code?: string })?.code as string | undefined;

        if (
          code === "auth/popup-blocked" ||
          code === "auth/operation-not-supported-in-this-environment"
        ) {
          await signInWithRedirect(auth, provider);
          return null;
        }

        throw e;
      }
    },
  });
}
