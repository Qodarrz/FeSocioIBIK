import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Eye, EyeOff, Loader2 } from "lucide-react";

// Import services
import authService from "@/services/authService";
import oauthService from "@/services/oauthService";
import tokenService from "@/services/tokenService";

// Types
import type { LoginData } from "@/services/authService";

const Login = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    if (tokenService.isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { email, password } = formData;

    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("📩 Form data to be sent:", formData);

    setLoading(true);
    try {
      const response = await authService.login(formData.email, formData.password);

      console.log("✅ API response:", response);

      if (response.success) {
        // Handle response structure from service
        if (response.data?.tokens) {
          // New response structure with data and tokens
          tokenService.setTokens(response.data.tokens);

          if (response.data.user) {
            tokenService.setUser(response.data.user);
          }

          toast.success("Login successful! Redirecting...");
          
          setTimeout(() => {
            navigate("/");
            window.location.reload(); // Refresh to update app state
          }, 1500);
          
        } else if (response.token) {
          // Old response structure (backward compatibility)

          if (response.user) {
            tokenService.setUser(response.user);
          }

          toast.success("Login successful! Redirecting...");
          
          setTimeout(() => {
            navigate("/");
            window.location.reload();
          }, 1500);
          
        } else {
          throw new Error("Invalid response structure");
        }
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);

      // Handle specific error messages
      const errorMessage = error.response?.data?.message || error.message || "Login failed. Please try again.";

      if (
        errorMessage.includes("Akun belum diverifikasi") ||
        errorMessage.includes("Silakan verifikasi email Anda")
      ) {
        toast.warning(errorMessage);
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
        return;
      }

      if (errorMessage.includes("Email atau password salah")) {
        toast.error("Invalid email or password");
        return;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    oauthService.google.redirectToGoogle();
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Image Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary">
        <div className="relative w-full h-full overflow-hidden">
          <div className="relative w-full h-full"></div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 overflow-y-auto bg-background">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto py-8">
          {/* Back Button */}
          <div className="w-full max-w-md mx-auto mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>

          {/* Login Card */}
          <Card className="bg-background">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-foreground">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Google OAuth Button */}
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={handleGoogleLogin}
                  className="w-full h-11 border-primary/20 hover:border-primary hover:bg-primary/5"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                      fill="#EB4335"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              {/* Separator */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="bg-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-background text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-background text-foreground border-input"
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-foreground">
                      Password
                    </Label>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="h-auto px-0 text-primary hover:text-primary/80"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="bg-background text-foreground border-input"
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Register Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
