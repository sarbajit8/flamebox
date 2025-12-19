import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  ThumbsUp,
  Download,
  Users,
  Calendar,
  Umbrella,
  DollarSign,
  FileText,
  MessageSquare,
  BarChart3,
  Layers,
  Shield,
  FileCheck,
  User,
  Image,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, logoutAllDevices } from "../../store/auth/auth-slice";

const AdminHeader = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showUserMenu]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still navigate to login even if logout fails
      navigate("/auth/login");
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      await dispatch(logoutAllDevices()).unwrap();
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout from all devices failed:", error);
      navigate("/auth/login");
    }
  };

  const getGreeting = () => {
    if (user) {
      const role = user.role === "admin" ? "Admin" : "Trainer";
      return `Hello ${role} ${user.fullName || user.userName}!`;
    }
    return "Hello!";
  };

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 sm:mb-8 space-y-4 lg:space-y-0 pt-16 lg:pt-0">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
          {getGreeting()}
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          {user?.role === "admin"
            ? "Manage your gym with full administrative access"
            : "Manage your assigned members and track their progress"}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-2 lg:space-x-4">
        <select className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 text-sm">
          <option>Year</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gray-800 text-white placeholder-gray-500 rounded-lg border border-gray-700 sm:w-48 lg:w-64 text-sm focus:border-red-500 focus:outline-none"
        />
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <span className="text-xs sm:text-sm text-gray-400 flex items-center hidden sm:flex">
            🇺🇸 English ▼
          </span>
          <div className="relative">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-700 rounded-full"></div>
            <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-full text-white text-xs flex items-center justify-center">
              2
            </span>
          </div>
          <div className="relative">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-700 rounded-full"></div>
            <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-full text-white text-xs flex items-center justify-center">
              2
            </span>
          </div>
          {/* User Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 bg-gradient-to-br from-red-600 to-red-700 rounded-full px-3 py-2 text-white hover:from-red-700 hover:to-red-800 transition-all"
            >
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline text-sm font-medium">
                {user?.userName || "User"}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                <div className="p-4 border-b border-gray-700">
                  <p className="text-white font-medium">
                    {user?.fullName || user?.userName}
                  </p>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                  <p className="text-xs text-red-400 mt-1 capitalize">
                    {user?.role} Access
                  </p>
                </div>

                <div className="py-2">
                  <Link
                    to="/admin/settings/schedulemanagement"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="inline w-4 h-4 mr-2" />
                    Profile Settings
                  </Link>

                  <button
                    onClick={handleLogoutAllDevices}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    <Shield className="inline w-4 h-4 mr-2" />
                    Logout All Devices
                  </button>

                  <hr className="my-2 border-gray-700" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600/10 hover:text-red-300 transition-colors"
                    disabled={isLoading}
                  >
                    <LogOut className="inline w-4 h-4 mr-2" />
                    {isLoading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
