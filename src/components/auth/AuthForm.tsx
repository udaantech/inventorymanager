import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"branch_manager" | "hq_admin">(
    "branch_manager",
  );
  const [error, setError] = useState("");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        await signIn(email, password);
        navigate("/dashboard");
      } else {
        await signUp(email, password, role);
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account.",
        });
        navigate("/login");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const errorMessage =
        err.message === "User already registered"
          ? "This email is already registered. Please log in instead."
          : err.message || "An error occurred";

      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-[400px] shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">
          {mode === "login" ? "Login" : "Register"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Enter your credentials to access your account"
            : "Create a new account to get started"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {mode === "register" && (
            <div className="space-y-2">
              <Label>Role</Label>
              <RadioGroup
                value={role}
                onValueChange={(value: "branch_manager" | "hq_admin") =>
                  setRole(value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="branch_manager" id="branch" />
                  <Label htmlFor="branch">Branch Manager</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hq_admin" id="hq" />
                  <Label htmlFor="hq">HQ Admin</Label>
                </div>
              </RadioGroup>
            </div>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full">
            {mode === "login" ? "Sign In" : "Sign Up"}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => navigate(mode === "login" ? "/register" : "/login")}
          >
            {mode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
