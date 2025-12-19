import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { verifySession } from "../../store/auth/auth-slice";

const ProtectedRoute = ({
  children,
  requiredRole = null,
  allowedRoles = [],
  redirectTo = "/auth/login",
}) => {
  const { user, isAuthenticated, sessionVerified, isLoading, error } =
    useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  // Verify session on mount if not already verified
  useEffect(() => {
    if (isAuthenticated && sessionVerified === null && !isLoading) {
      console.log("🔐 Verifying session on mount...");
      dispatch(verifySession());
    }
  }, [dispatch, isAuthenticated, sessionVerified, isLoading]);

  // If session verification is in progress (null = not checked yet), wait for it
  if (isAuthenticated && sessionVerified === null) {
    console.log("⏳ Waiting for session verification...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If session verification failed (false), redirect to login
  if (sessionVerified === false) {
    console.log("❌ Session verification failed, redirecting to login");
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If not authenticated and no user, redirect to login
  if (!isAuthenticated || !user) {
    console.log("❌ Not authenticated, redirecting to login");
    localStorage.removeItem("user");
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  const userRole = user.role;

  // If specific role is required
  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required role: <span className="text-red-400">{requiredRole}</span>
            <br />
            Your role: <span className="text-blue-400">{userRole}</span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // If array of allowed roles is provided
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Allowed roles:{" "}
            <span className="text-green-400">{allowedRoles.join(", ")}</span>
            <br />
            Your role: <span className="text-blue-400">{userRole}</span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // All checks passed, render the protected component
  return children;
};

export default ProtectedRoute;
