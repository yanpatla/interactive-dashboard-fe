import { useGoogleLogin } from "@/hooks/auth/useGoogleLogin";
import { useNavigate } from "react-router-dom";

export default function ButtonGoogle() {
  const navigate = useNavigate();
  const googleLogin = useGoogleLogin();
  const onGoogle = async () => {
    const user = await googleLogin.mutateAsync();
    if (user) navigate("/dashboard", { replace: true });
  };
  return (
    <button
      type="button"
      className="w-full border rounded p-2 cursor-pointer"
      onClick={onGoogle}
      disabled={googleLogin.isPending}
    >
      {googleLogin.isPending ? "Opening Google..." : "Continue with Google"}
    </button>
  );
}
