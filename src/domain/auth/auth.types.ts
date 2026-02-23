 

export type UserRole = "viewer" | "editor";
export type AuthUser = {
  uid: string;
  email: string;
  name: string | null;
  picture: string | null;
  role: UserRole;
};

export interface AuthRepository {
  onAuthStateChanged(cb: (user: AuthUser | null) => void): () => void;

  loginWithEmail(email: string, password: string): Promise<void>;
  registerWithEmail(email: string, password: string): Promise<void>;
  loginWithGooglePopup(): Promise<void>;
  logout(): Promise<void>;

  getIdToken(): Promise<string | null>;
}
