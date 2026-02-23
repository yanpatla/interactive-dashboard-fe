import { useHandleAuthRedirect } from "@/hooks/auth/useHandleRedirect";
import { Outlet, useNavigate } from "react-router-dom";

export default function AuthLayout() {
  const navigate = useNavigate();

  useHandleAuthRedirect(() => {
    navigate("/dashboard", { replace: true });
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
