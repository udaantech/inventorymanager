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
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }

        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (userData) {
          setUser(userData);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) throw signInError;
    if (!authData.user) throw new Error("No user returned from sign in");

    // Fetch user profile
    const { data: userData, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !userData) {
      await supabase.auth.signOut(); // Sign out if profile not found
      throw new Error(
        "User profile not found. Please verify your email first.",
      );
    }

    setUser(userData);
    return userData;
  };

  const signUp = async (
    email: string,
    password: string,
    role: "branch_manager" | "hq_admin",
  ) => {
    try {
      // Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: { role },
          },
        },
      );

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("No user returned from sign up");

      // Create user profile using the service role client
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .insert([
          {
            id: authData.user.id,
            email,
            role,
          },
        ])
        .select()
        .single();

      if (profileError) {
        console.error("Error creating profile:", profileError);
        throw new Error("Failed to create user profile");
      }

      return {
        user: authData.user,
        profile: profileData,
        needsEmailConfirmation: true, // Supabase requires email confirmation by default
        profileCreated: true,
      };
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
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
