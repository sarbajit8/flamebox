import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Shield,
  UserCheck,
  Phone,
  Mail,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  Calendar,
  Activity,
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "trainer",
    adminEmail: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/auth/users/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      console.error("Fetch Users Error:", error);
      setMessage({ type: "error", text: "Failed to fetch users" });
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phoneNumber?.includes(searchTerm)
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        filtered = filtered.filter((user) => user.isActive === true);
      } else {
        filtered = filtered.filter((user) => user.isActive === false);
      }
    }

    setFilteredUsers(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      userName: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      role: "trainer",
      adminEmail: currentUser.email || "",
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (formData.password.length < 6) {
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
        }/api/auth/users/register`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            adminEmail:
              formData.role === "trainer"
                ? formData.adminEmail || currentUser.email
                : null,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessage({
          type: "success",
          text: `${formData.role} created successfully`,
        });
        setIsModalOpen(false);
        resetForm();
        fetchUsers();
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      console.error("Create User Error:", error);
      setMessage({ type: "error", text: "Failed to create user" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/auth/users/${userId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !currentStatus }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessage({
          type: "success",
          text: `User ${
            !currentStatus ? "activated" : "deactivated"
          } successfully`,
        });
        fetchUsers();
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      console.error("Toggle Status Error:", error);
      setMessage({ type: "error", text: "Failed to update user status" });
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/auth/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: "User deleted successfully" });
        fetchUsers();
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      console.error("Delete User Error:", error);
      setMessage({ type: "error", text: "Failed to delete user" });
    }
  };

  const getRoleColor = (role) => {
    return role === "admin"
      ? "bg-red-600/20 text-red-400 border-red-500/30"
      : "bg-blue-600/20 text-blue-400 border-blue-500/30";
  };

  const getRoleIcon = (role) => {
    return role === "admin" ? (
      <Shield className="w-4 h-4" />
    ) : (
      <UserCheck className="w-4 h-4" />
    );
  };

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    trainers: users.filter((u) => u.role === "trainer").length,
    active: users.filter((u) => u.isActive).length,
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              User Management
            </h1>
            <p className="text-gray-400 text-sm">
              Manage admin and trainer accounts
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        </div>

        {/* Success/Error Messages */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
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
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Admins</p>
                <p className="text-3xl font-bold text-white">{stats.admins}</p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Trainers</p>
                <p className="text-3xl font-bold text-white">
                  {stats.trainers}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Active Users</p>
                <p className="text-3xl font-bold text-white">{stats.active}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="trainer">Trainer</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                    User
                  </th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                    Contact
                  </th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                    Role
                  </th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                    Created
                  </th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto" />
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-white">
                            {user.fullName}
                          </p>
                          <p className="text-sm text-gray-400">
                            @{user.userName}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Phone className="w-4 h-4" />
                            {user.phoneNumber}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {getRoleIcon(user.role)}
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            user.isActive
                              ? "bg-green-600/20 text-green-400"
                              : "bg-red-600/20 text-red-400"
                          }`}
                        >
                          {user.isActive ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {user._id !== currentUser.id && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleToggleStatus(user._id, user.isActive)
                              }
                              className={`p-2 rounded-lg transition-colors ${
                                user.isActive
                                  ? "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30"
                                  : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                              }`}
                              title={user.isActive ? "Deactivate" : "Activate"}
                            >
                              {user.isActive ? (
                                <XCircle className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteUser(user._id, user.userName)
                              }
                              className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">Add New User</h2>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter username"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter email"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="trainer">Trainer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Admin Email (for trainers) */}
              {formData.role === "trainer" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Admin Email *
                  </label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter admin email"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                    className="w-full px-4 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                    className="w-full px-4 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Create User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
