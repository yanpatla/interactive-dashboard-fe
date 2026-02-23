import ButtonGoogle from "@/components/ButtonGoogle";
import { useLogin } from "@/hooks/auth/useLogin";
import { loginSchema, type LoginInput } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await login.mutateAsync(values);
    navigate("/dashboard", { replace: true });
  });
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Login</h1>

      <form className="space-y-3" onSubmit={onSubmit}>
        <div className="space-y-1">
          <label className="text-sm">Email</label>
          <input
            className="w-full border p-2 rounded"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-600">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm">Password</label>
          <input
            className="w-full border p-2 rounded"
            type="password"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-red-600">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {login.error && <p className="text-sm text-red-600">Login failed</p>}

        <ButtonGoogle />
        <div className="text-center text-xs text-muted-foreground">or</div>
        <button
          className="w-full border rounded p-2 cursor-pointer"
          disabled={login.isPending}
        >
          {login.isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-sm">
        do no have an account yet?{" "}
        <Link className="underline" to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}
