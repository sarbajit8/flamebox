import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Shield,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { loginUser } from "../../store/auth/auth-slice";

const RoleBasedLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [selectedRole, setSelectedRole] = useState("admin");
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user types
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const result = await dispatch(
        loginUser({
          emailOrPhone: formData.emailOrPhone,
          password: formData.password,
          role: selectedRole,
        })
      ).unwrap();

      setMessage({
        type: "success",
        text: `Welcome back, ${result.user.fullName}!`,
      });

      // Redirect based on role (reduced timeout and direct navigation)
      setTimeout(() => {
        if (result.user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (result.user.role === "trainer") {
          navigate("/trainer/dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }, 500);
    } catch (error) {
      console.error("Login Error:", error);
      setMessage({
        type: "error",
        text:
          error || "Network error. Please check your connection and try again.",
      });
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    return /^[0-9]{10,15}$/.test(phone);
  };

  const getInputType = () => {
    if (isValidEmail(formData.emailOrPhone)) return "email";
    if (isValidPhone(formData.emailOrPhone)) return "phone";
    return "text";
  };

  const getRoleIcon = (role) => {
    return role === "admin" ? (
      <Shield className="w-5 h-5" />
    ) : (
      <UserCheck className="w-5 h-5" />
    );
  };

  const getRoleColor = (role) => {
    return role === "admin"
      ? "from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
      : "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["admin", "trainer"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                    selectedRole === role
                      ? `border-${role === "admin" ? "red" : "blue"}-500 bg-${
                          role === "admin" ? "red" : "blue"
                        }-600/10`
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedRole === role
                        ? `bg-gradient-to-r ${getRoleColor(role)} text-white`
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {getRoleIcon(role)}
                  </div>
                  <span
                    className={`text-sm font-medium capitalize ${
                      selectedRole === role ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Phone Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email or Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {getInputType() === "email" ? (
                    <Mail className="w-5 h-5 text-gray-400" />
                  ) : getInputType() === "phone" ? (
                    <Phone className="w-5 h-5 text-gray-400" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <input
                  type="text"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter email or phone number"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <div
                className={`p-4 rounded-lg flex items-center gap-3 ${
                  message.type === "success"
                    ? "bg-green-500/10 border border-green-500 text-green-500"
                    : "bg-red-500/10 border border-red-500 text-red-500"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isLoading || !formData.emailOrPhone || !formData.password
              }
              className={`w-full py-3 px-6 bg-gradient-to-r ${getRoleColor(
                selectedRole
              )} text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  {getRoleIcon(selectedRole)}
                  Sign In as{" "}
                  {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                </>
              )}
            </button>

            {/* Links */}
            <div className="text-center space-y-3">
              <Link
                to="/auth/forgot-password"
                className="block text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot your password?
              </Link>

              {selectedRole === "trainer" && (
                <div className="pt-2 border-t border-gray-700">
                  <p className="text-gray-400 text-xs mb-2">New trainer?</p>
                  <Link
                    to="/auth/trainer/register"
                    className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                    Register as Trainer
                  </Link>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Need help? Contact your administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLogin;
