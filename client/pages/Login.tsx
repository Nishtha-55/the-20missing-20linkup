import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authUtils } from "@/utils/auth";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = authUtils.login(email, password);

    if (result.success) {
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      toast.error(result.error || "Login failed");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back Home Link */}
        <Link
          to="/"
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Login to your Campus Lost & Found account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
            <p className="text-xs text-muted-foreground">
              <strong>Demo Account:</strong>
              <br />
              Email: demo@campus.edu
              <br />
              Password: demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
