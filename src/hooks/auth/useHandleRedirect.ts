import { useEffect } from "react";
import { getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseApp";

export function useHandleAuthRedirect(onSuccess: () => void) {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await getRedirectResult(auth);
        if (!cancelled && res?.user) onSuccess();
      } catch (e) {
        console.log(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [onSuccess]);
}
