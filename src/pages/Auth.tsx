import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate auth - replace with real auth later
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ email, name: name || email.split("@")[0] }));
      toast({
        title: isLogin ? "Welcome back" : "Account created",
        description: "Redirecting to your dashboard...",
      });
      setIsLoading(false);
      navigate("/videos");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif text-cream tracking-wide">revvere</h1>
            <p className="text-muted-foreground mt-2 text-sm">return to your Self</p>
          </div>

          {/* Form */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg">
            <h2 className="text-2xl font-serif text-foreground mb-2">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              {isLogin
                ? "Enter your details to access your journey"
                : "Start your wellness journey today"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                variant="cream"
                size="lg"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-cream transition-colors"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="text-cream font-medium">
                  {isLogin ? "Sign up" : "Sign in"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-brown/50 to-charcoal-deep" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center animate-slide-up">
            <h2 className="text-4xl font-serif text-foreground mb-4">
              Your journey to <span className="italic text-cream">wellness</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Access exclusive video content, guided practices, and connect with a
              community of mindful women.
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cream/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-rose-soft/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Auth;
