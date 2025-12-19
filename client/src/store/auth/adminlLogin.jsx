import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Dumbbell,
  AlertCircle,
} from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setLoginError("");
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginError("");

    try {
      // Make actual API call to login endpoint
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Store authentication token and user data
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        localStorage.setItem("adminEmail", data.user.email);

        // Navigate to dashboard
        navigate("/admin/dashboard");
      } else {
        setLoginError(data.error || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        "Login failed. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-2xl shadow-red-500/50 mb-4">
            <Dumbbell className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
              Flame
            </span>
            <span className="text-white">Box</span>
          </h1>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm">
              Sign in to access your admin dashboard
            </p>
          </div>

          {/* Login Error Alert */}
          {loginError && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 text-sm font-medium">Login Failed</p>
                <p className="text-red-300 text-xs mt-1">{loginError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@example.com"
                className={`w-full px-4 py-3 bg-gray-700 border ${
                  errors.email ? "border-red-500" : "border-gray-600"
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
                } focus:border-transparent transition-all`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-12 bg-gray-700 border ${
                    errors.password ? "border-red-500" : "border-gray-600"
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } focus:border-transparent transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-300">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Sign In as Admin
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-300 font-semibold mb-2">
              Demo Credentials:
            </p>
            <div className="space-y-1 text-xs text-blue-200">
              <p>
                Email:{" "}
                <span className="font-mono bg-blue-900/30 px-2 py-0.5 rounded">
                  admin@flamebox.com
                </span>
              </p>
              <p>
                Password:{" "}
                <span className="font-mono bg-blue-900/30 px-2 py-0.5 rounded">
                  admin123
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2024 FlameBox Gym. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
