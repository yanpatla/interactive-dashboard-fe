export type UserRole = "viewer" | "editor";

export type MeResponse = {
  uid: string;
  email: string;
  name?: string | null;
  picture?: string | null;
  role: UserRole;
};
