// import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
// import Sonner from "./components/ui/sonner";

import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/layout";
import AdminDashboard from "./pages/admin/dashboard";
import TestDashboard from "./pages/admin/TestDashboard";
import Addmember from "./pages/admin/addmember";
import GymLeadsTracking from "./pages/admin/addleads";
import GymAttendance from "./pages/admin/attendance";
import GymScheduleManagement from "./pages/admin/setopening";
import Layoutsettings from "./components/admin/layout2";
import AddEmployee from "./pages/admin/addemployee";
import AddPackages from "./pages/admin/addpackages";
import AdminLogin from "./pages/auth/adminlLogin";
import AdminAuthLayout from "./components/auth/adminAuthLayout";
import RoleBasedLogin from "./pages/auth/RoleBasedLogin";
import TrainerRegistration from "./pages/auth/TrainerRegistration";
import OTPVerification from "./pages/auth/OTPVerification";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ProtectedRoute from "./components/common/ProtectedRoute";
import TrainerLayout from "./components/trainer/layout";
import TrainerDashboard from "./pages/trainer/dashboard";
import PaymentHistory from "./pages/admin/paymenthistory";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifySession } from "./store/auth/auth-slice";

const queryClient = new QueryClient();

const AppContent = () => {
  const dispatch = useDispatch();

  // Verify session on app mount (optional - ProtectedRoute will also verify)
  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser && parsedUser._id) {
          console.log("🔄 Verifying session on app mount...");
          dispatch(verifySession()).catch((err) => {
            console.error("Session verification failed on mount:", err);
          });
        }
      }
    } catch (error) {
      console.error("Error during app mount session check:", error);
      localStorage.removeItem("user");
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect to role-based login */}
        <Route path="/" element={<AdminAuthLayout />}>
          <Route index element={<RoleBasedLogin />} />
        </Route>

        {/* Authentication routes */}
        <Route path="/auth" element={<AdminAuthLayout />}>
          <Route path="login" element={<RoleBasedLogin />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="trainer/register" element={<TrainerRegistration />} />
          <Route path="trainer/otp" element={<OTPVerification />} />
        </Route>

        {/* Legacy admin login route for backward compatibility */}
        <Route path="/login" element={<AdminAuthLayout />}>
          <Route index element={<AdminLogin />} />
        </Route>

        {/* Protected Admin dashboard routes - Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="addmember" element={<Addmember />} />
          <Route path="addleads" element={<GymLeadsTracking />} />
          <Route path="addattendance" element={<GymAttendance />} />
          <Route path="addemployee" element={<AddEmployee />} />
          <Route path="addpackages" element={<AddPackages />} />
          <Route path="paymenthistory" element={<PaymentHistory />} />

          <Route path="settings" element={<Layoutsettings />}>
            <Route
              path="schedulemanagement"
              element={<GymScheduleManagement />}
            />
          </Route>
        </Route>

        {/* Protected Trainer dashboard routes - Trainer only */}
        <Route
          path="/trainer"
          element={
            <ProtectedRoute allowedRoles={["trainer"]}>
              <TrainerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TrainerDashboard />} />
          <Route path="dashboard" element={<TrainerDashboard />} />
        </Route>

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
