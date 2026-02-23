import { useAuth } from "@/hooks/auth/useAuth";
import { useAuthState } from "@/hooks/auth/useAuthState";
import { useLogout } from "@/hooks/auth/useLogout";
import { Outlet, useNavigate } from "react-router-dom";

export default function AppLayout() {
  const navigate = useNavigate();
  const { isAuthed } = useAuthState();
  const { isLoading, data, isError } = useAuth(isAuthed);
  const { isPending, mutateAsync } = useLogout();

  const onLogout = async () => {
    await mutateAsync();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen">
      <header className="border-b p-4 flex items-center justify-between gap-4">
        <div className="font-semibold">Traffic Dashboard</div>

        <div className="text-sm flex items-center gap-3">
          {isLoading && <span>Loading user…</span>}

          {data && (
            <>
              <span>{data.name ?? data.email}</span>
              <span className="px-2 py-0.5 border rounded">{data.role}</span>
            </>
          )}

          {isError && <span className="text-red-600">User load failed</span>}

          <button
            className="border rounded px-3 py-1"
            onClick={onLogout}
            disabled={isPending}
          >
            {isPending ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </header>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
