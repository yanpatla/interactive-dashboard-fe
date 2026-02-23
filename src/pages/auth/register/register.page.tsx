import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "@/hooks/auth/useRegister";
import { loginSchema, type LoginInput } from "@/types/auth";
import ButtonGoogle from "@/components/ButtonGoogle";

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useRegister();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await registerUser.mutateAsync(values);
    navigate("/dashboard", { replace: true });
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Register</h1>

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

        {registerUser.error && (
          <p className="text-sm text-red-600">Register failed</p>
        )}
        <ButtonGoogle />
        <div className="text-center text-xs text-muted-foreground">or</div>
        <button
          className="w-full border rounded p-2"
          disabled={registerUser.isPending}
        >
          {registerUser.isPending ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="text-sm">
        Already have an account?{" "}
        <Link className="underline" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}
