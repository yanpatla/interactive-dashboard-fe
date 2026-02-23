import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuthState } from "../hooks/auth/useAuthState";
import AuthLayout from "@/layout/AuthLayout";
import AppLayout from "@/layout/AppLayout";

const LoginPage = lazy(() => import("../pages/auth/login/login.page"));
const RegisterPage = lazy(() => import("../pages/auth/register/register.page"));
const DashboardPage = lazy(() => import("../pages/dashboard/dashboard.page"));

function RouteFallback() {
  return <div className="p-4">Loading…</div>;
}

function RequireAuth() {
  const { loading, isAuthed } = useAuthState();
  if (loading) return <RouteFallback />;
  if (!isAuthed) return <Navigate to="/login" replace />;
  return <Outlet />;
}
export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<div className="p-4">404</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
