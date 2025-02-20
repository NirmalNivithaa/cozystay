
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = Date.now();
    if (now - lastAttemptTime < 2000) {
      toast.error("Please wait a moment before trying again");
      return;
    }
    setLastAttemptTime(now);
    
    setIsLoading(true);

    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes('rate_limit')) {
          toast.error("Please wait a moment before trying again");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (isSignUp) {
        toast.success("Check your email to confirm your account");
      } else {
        toast.success("Successfully logged in!");
        navigate("/hotel");
      }
    } catch (error: any) {
      const errorMessage = error.message.includes('rate_limit') 
        ? "Please wait a moment before trying again"
        : error.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#9b87f5] via-[#D6BCFA] to-[#F97316]">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e')] bg-cover bg-center opacity-20" />
      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-white/80">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isSignUp 
              ? "Sign up for an amazing hotel experience" 
              : "Sign in to continue your journey"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/50 backdrop-blur-sm"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                type="button"
                className="text-purple-600 hover:text-purple-700 font-semibold"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
