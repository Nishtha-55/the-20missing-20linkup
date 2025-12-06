import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authUtils } from "@/utils/auth";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";

type Step = "email" | "reset" | "success";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!authUtils.emailExists(email)) {
      toast.error("Email not found in our system");
      return;
    }

    setStep("reset");
    toast.success("Email verified! Please set your new password");
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    const result = authUtils.resetPassword(email, newPassword);

    if (result.success) {
      setStep("success");
      toast.success("Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      toast.error(result.error || "Failed to reset password");
    }

    setIsLoading(false);
  };

  const passwordStrength = newPassword.length >= 8 ? "strong" : newPassword.length >= 6 ? "medium" : "weak";
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

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
          {step === "email" && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔑</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Forgot Password?
                </h1>
                <p className="text-muted-foreground">
                  Enter your email to reset your password
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warning focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll send you a password reset link if the email is registered
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-warning text-white rounded-xl font-semibold hover:bg-warning/90 transition-colors shadow-lg hover:shadow-xl"
                >
                  Send Reset Instructions
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              {/* Links */}
              <div className="space-y-3 text-center">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-primary font-semibold hover:text-primary/80 transition-colors"
                  >
                    Login
                  </Link>
                </p>
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-secondary font-semibold hover:text-secondary/80 transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </>
          )}

          {step === "reset" && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔐</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Reset Password
                </h1>
                <p className="text-muted-foreground">
                  Set your new password
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleResetSubmit} className="space-y-6">
                {/* New Password Field */}
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-foreground">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                  {newPassword && (
                    <p className="text-xs text-muted-foreground">
                      Password strength:{" "}
                      <span
                        className={
                          passwordStrength === "strong"
                            ? "text-success font-semibold"
                            : passwordStrength === "medium"
                              ? "text-warning font-semibold"
                              : "text-destructive font-semibold"
                        }
                      >
                        {passwordStrength === "strong" ? "Strong" : passwordStrength === "medium" ? "Medium" : "Weak"}
                      </span>
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && passwordsMatch && (
                    <p className="text-xs text-success font-semibold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Passwords match
                    </p>
                  )}
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-destructive font-semibold">
                      Passwords do not match
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !passwordsMatch}
                  className="w-full px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              {/* Back Link */}
              <div className="text-center mt-6">
                <button
                  onClick={() => {
                    setEmail("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setStep("email");
                  }}
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Back to email verification
                </button>
              </div>
            </>
          )}

          {step === "success" && (
            <>
              {/* Success State */}
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Password Reset Successful!
                  </h1>
                  <p className="text-muted-foreground">
                    Your password has been updated. Redirecting to login...
                  </p>
                </div>
                <Link
                  to="/login"
                  className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Go to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
