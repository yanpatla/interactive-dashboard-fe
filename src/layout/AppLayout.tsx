import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/auth/useAuth";
import { useAuthState } from "@/hooks/auth/useAuthState";
import { useLogout } from "@/hooks/auth/useLogout";
import { LogOut } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

function initials(nameOrEmail: string) {
  const v = nameOrEmail.trim();
  if (!v) return "U";
  const parts = v.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
export default function AppLayout() {
  const navigate = useNavigate();
  const { isAuthed } = useAuthState();
  const { isLoading, data, isError } = useAuth(isAuthed);
  const { isPending, mutateAsync } = useLogout();

  const onLogout = async () => {
    await mutateAsync();
    navigate("/login", { replace: true });
  };
  const displayName = data?.name ?? data?.email ?? "";
  const role = data?.role ?? "";
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg border bg-muted font-semibold">
              TD
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Traffic Dashboard</div>
              <div className="text-xs text-muted-foreground">
                Analytics & management
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoading && (
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            )}

            {isError && (
              <Alert className="hidden sm:block">
                <AlertTitle>User load failed</AlertTitle>
                <AlertDescription>
                  We could not load your user data. Try to reload the page.
                </AlertDescription>
              </Alert>
            )}

            {data && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={data.picture ?? undefined}
                        alt={displayName}
                      />
                      <AvatarFallback>
                        {initials(displayName || "User")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="hidden text-left sm:block">
                      <div className="text-sm font-medium leading-none">
                        {displayName}
                      </div>
                      <div className="mt-1">
                        <Badge variant="secondary" className="px-2 py-0">
                          {role}
                        </Badge>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="space-y-1">
                    <div className="text-sm font-semibold">{displayName}</div>
                    <div className="text-xs text-muted-foreground">
                      Role: {role}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onLogout}
                    disabled={isPending}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    {isPending ? "Signing out…" : "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {!isLoading && !data && (
              <Button variant="outline" onClick={() => navigate("/login")}>
                Go to login
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
