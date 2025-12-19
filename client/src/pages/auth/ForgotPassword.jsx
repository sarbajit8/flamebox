import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Phone,
  Shield,
  UserCheck,
  KeyRound,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("request"); // 'request' or 'reset'
  const [selectedRole, setSelectedRole] = useState("admin");
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [userId, setUserId] = useState("");

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

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/auth/users/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailOrPhone: formData.emailOrPhone,
            role: selectedRole,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setUserId(data.userId);
        setStep("reset");

        // Show OTP in alert popup since email is not configured
        if (data.otp) {
          const otpMessage =
            selectedRole === "admin"
              ? `OTP Generated Successfully!\n\nYour OTP is: ${data.otp}\n\nThis OTP will expire in 10 minutes.`
              : `OTP Generated!\n\nOTP: ${data.otp}\nAdmin Email: ${data.recipientEmail}\n\nPlease contact your admin for approval.\nThis OTP will expire in 10 minutes.`;

          alert(otpMessage);
        }

        setMessage({
          type: "success",
          text:
            selectedRole === "admin"
              ? "OTP generated successfully! Check the popup."
              : "OTP generated! Please contact your admin for approval.",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to send OTP",
        });
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      setMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/auth/users/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            otp: formData.otp,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "Password reset successfully! Redirecting to login...",
        });

        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to reset password",
        });
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      setMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
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
            to="/auth/login"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {step === "request" ? "Forgot Password" : "Reset Password"}
            </h1>
            <p className="text-gray-400">
              {step === "request"
                ? "Enter your details to receive an OTP"
                : "Enter the OTP and your new password"}
            </p>
          </div>

          {step === "request" ? (
            <>
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
                          ? `border-${
                              role === "admin" ? "red" : "blue"
                            }-500 bg-${
                              role === "admin" ? "red" : "blue"
                            }-600/10`
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          selectedRole === role
                            ? `bg-gradient-to-r ${getRoleColor(
                                role
                              )} text-white`
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

              {/* OTP Request Form */}
              <form onSubmit={handleRequestOTP} className="space-y-6">
                {/* Email/Phone Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email or Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      {getInputType() === "email" ? (
                        <Mail className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Phone className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <input
                      type="text"
                      name="emailOrPhone"
                      value={formData.emailOrPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Enter email or phone number"
                    />
                  </div>
                </div>

                {/* Info Message for Trainer */}
                {selectedRole === "trainer" && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-blue-400 text-sm font-medium">
                          Trainer Password Reset
                        </p>
                        <p className="text-blue-300 text-xs mt-1">
                          The OTP will be sent to your admin's email. Please
                          contact your admin to get the OTP.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !formData.emailOrPhone}
                  className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send OTP
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Reset Password Form */
            <form onSubmit={handleResetPassword} className="space-y-6">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  OTP Code
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  required
                  maxLength="6"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-center text-lg tracking-widest"
                  placeholder="000000"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                    className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Enter new password"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                    className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
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
                disabled={
                  isLoading ||
                  !formData.otp ||
                  !formData.newPassword ||
                  !formData.confirmPassword
                }
                className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </button>

              {/* Back to Request OTP */}
              <button
                type="button"
                onClick={() => {
                  setStep("request");
                  setMessage({ type: "", text: "" });
                }}
                className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Request new OTP
              </button>
            </form>
          )}

          {/* Message */}
          {message.text && (
            <div
              className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
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
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Remember your password?{" "}
            <Link
              to="/auth/login"
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
