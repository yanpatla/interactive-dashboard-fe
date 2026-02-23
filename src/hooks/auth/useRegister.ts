import { useMutation } from "@tanstack/react-query";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseApp";
import type { LoginInput } from "../../types/auth";

export function useRegister() {
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const cred = await createUserWithEmailAndPassword(
        auth,
        input.email,
        input.password,
      );
      return cred.user;
    },
  });
}
