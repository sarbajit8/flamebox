import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Shield,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Mail,
  RefreshCw,
} from "lucide-react";
import {
  verifyTrainerOTP,
  resendTrainerOTP,
  clearError,
  clearSuccess,
} from "../../store/auth/auth-slice";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isLoading, error, success, message } = useSelector(
    (state) => state.auth
  );

  // Get data from navigation state
  const userId = location.state?.userId;
  const registrationData = {
    email: location.state?.email || "trainer@example.com",
    fullName: location.state?.fullName || "Trainer",
    otp: location.state?.otp,
    adminEmail: location.state?.adminEmail,
  };

  console.log("OTPVerification - location.state:", location.state);
  console.log("OTPVerification - userId:", userId);
  console.log("OTPVerification - registrationData:", registrationData);

  useEffect(() => {
    // Redirect if no userId
    if (!userId) {
      console.log("OTPVerification - No userId, redirecting to register");
      navigate("/auth/trainer/register");
      return;
    }

    // Clear any previous errors/success
    dispatch(clearError());
    dispatch(clearSuccess());

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [userId, navigate, dispatch]);

  // Handle successful verification
  useEffect(() => {
    if (success && message) {
      setTimeout(() => {
        navigate("/auth/login", {
          state: {
            message: "Registration completed successfully! You can now login.",
          },
        });
      }, 2000);
    }
  }, [success, message, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setLocalError("Please enter the complete 6-digit OTP");
      return;
    }

    setLocalError("");
    dispatch(clearError());

    try {
      await dispatch(
        verifyTrainerOTP({
          userId,
          otp: otpCode,
        })
      ).unwrap();

      // Navigation will be handled by useEffect when success state changes
    } catch (error) {
      setLocalError(error || "Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    setLocalError("");
    dispatch(clearError());

    try {
      const result = await dispatch(resendTrainerOTP({ userId })).unwrap();

      // Show OTP in alert popup since email is not configured
      if (result.otp) {
        alert(
          `New OTP Generated!\n\n` +
            `OTP: ${result.otp}\n\n` +
            `Admin Email: ${result.adminEmail}\n\n` +
            `Please contact your admin for the new OTP.\n` +
            `This OTP will expire in 10 minutes.`
        );
      }

      setTimeLeft(300); // Reset timer
    } catch (error) {
      setLocalError(error || "Failed to resend OTP");
    }
  };

  if (success && message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
            <p className="text-green-400 mb-6">{message}</p>
            <p className="text-gray-400 text-sm">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              OTP Verification
            </h1>
            <p className="text-gray-400 text-sm mb-4">
              An OTP has been sent to the admin for verification
            </p>

            {/* User Info */}
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center text-gray-300 text-sm">
                <Mail className="w-4 h-4 mr-2" />
                {registrationData.email}
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Trainer: {registrationData.fullName}
              </p>
            </div>

            {/* Timer */}
            <div className="text-center mb-4">
              <p className="text-gray-400 text-sm">
                Time remaining:{" "}
                <span className="text-red-400 font-medium">
                  {formatTime(timeLeft)}
                </span>
              </p>
            </div>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
                Enter 6-digit OTP from admin
              </label>
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`w-12 h-12 text-center text-xl font-bold bg-gray-700 border ${
                      error ? "border-red-500" : "border-gray-600"
                    } rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors`}
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {(localError || error) && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm text-center">
                  {localError || error}
                </p>
              </div>
            )}

            {/* Success Message */}
            {message && !isLoading && !(localError || error) && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm text-center">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || otp.join("").length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mb-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </div>
              ) : (
                "Verify OTP"
              )}
            </button>

            {/* Resend Button */}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading || timeLeft > 0}
              className="w-full bg-gray-700 text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Resending...
                </div>
              ) : timeLeft > 0 ? (
                `Resend OTP (${formatTime(timeLeft)})`
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 inline" />
                  Resend OTP
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link
              to="/auth/trainer/register"
              className="flex items-center justify-center text-gray-400 text-sm hover:text-red-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registration
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>The OTP is sent to the admin email for security verification.</p>
            <p className="mt-1">
              Please contact your administrator if you don't receive the OTP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
