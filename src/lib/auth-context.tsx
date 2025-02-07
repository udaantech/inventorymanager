import { createContext } from "react";

type User = {
  id: string;
  email: string;
  role: "branch_manager" | "hq_admin";
} | null;

type AuthContextType = {
  user: User;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    role: "branch_manager" | "hq_admin",
  ) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
