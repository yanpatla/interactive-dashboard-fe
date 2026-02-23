import { auth } from "@/lib/firebase/firebaseApp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await signOut(auth);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
