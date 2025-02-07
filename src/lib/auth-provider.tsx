import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { AuthContext } from "./auth-context";

type User = {
  id: string;
  email: string;
  role: "branch_manager" | "hq_admin";
} | null;

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const {
      error,
      data: { user: authUser },
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    if (authUser) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (userError) throw userError;
      setUser(userData);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    role: "branch_manager" | "hq_admin",
  ) => {
    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role,
        },
      },
    });
    if (signUpError) throw signUpError;

    if (data.user) {
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email,
          role,
        },
      ]);

      if (insertError) throw insertError;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
