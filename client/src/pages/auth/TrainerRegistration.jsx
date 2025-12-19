import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import {
  trainerRegistration,
  clearError,
  clearSuccess,
} from "../../store/auth/auth-slice";

const TrainerRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, success, isLoading, trainerRegistrationData } = useSelector(
    (state) => state.auth
  );

  // Effect to handle successful registration
  useEffect(() => {
    console.log("TrainerRegistration - success:", success);
    console.log(
      "TrainerRegistration - trainerRegistrationData:",
      trainerRegistrationData
    );

    if (success && trainerRegistrationData && trainerRegistrationData.userId) {
      // Show OTP in alert popup since email is not configured
      if (trainerRegistrationData.otp) {
        alert(
          `Trainer Registration Successful!\n\n` +
            `OTP for Admin Verification: ${trainerRegistrationData.otp}\n\n` +
            `Admin Email: ${trainerRegistrationData.adminEmail}\n\n` +
            `Please contact your admin and provide them with this OTP.\n` +
            `The OTP will expire in 10 minutes.`
        );
      }

      // Clear success state before navigation to prevent re-triggering
      dispatch(clearSuccess());

      navigate("/auth/trainer/otp", {
        state: {
          userId: trainerRegistrationData.userId,
          email: formData.email,
          fullName: formData.fullName,
          otp: trainerRegistrationData.otp,
          adminEmail: trainerRegistrationData.adminEmail,
        },
        replace: true,
      });
    }
  }, [success, trainerRegistrationData, navigate, dispatch]);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Clear previous errors
    dispatch(clearError());
    setErrors({});

    try {
      await dispatch(
        trainerRegistration({
          fullName: formData.fullName.trim(),
          userName: formData.email.split("@")[0], // Generate username from email
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          password: formData.password,
        })
      ).unwrap();

      // Navigation will be handled by useEffect when success state changes
    } catch (error) {
      setErrors({ submit: error || "Registration failed" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Trainer Registration
            </h1>
            <p className="text-gray-400 text-sm">
              Join FlameBox Fitness as a trainer
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-700 border ${
                    errors.fullName ? "border-red-500" : "border-gray-600"
                  } rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-700 border ${
                    errors.email ? "border-red-500" : "border-gray-600"
                  } rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors`}
                  placeholder="trainer@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-700 border ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-600"
                  } rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-11 py-3 bg-gray-700 border ${
                    errors.password ? "border-red-500" : "border-gray-600"
                  } rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-11 py-3 bg-gray-700 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-600"
                  } rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {(errors.submit || error) && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{errors.submit || error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Registering...
                </div>
              ) : (
                "Register as Trainer"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center text-gray-400 text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <Link
                to="/auth/login"
                className="hover:text-red-400 transition-colors"
              >
                Back to Login
              </Link>
            </div>

            <div className="text-xs text-gray-500">
              <p>By registering, you agree to our terms and conditions.</p>
              <p className="mt-1">
                <span className="text-yellow-400">Note:</span> Registration
                requires admin approval via OTP verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerRegistration;
