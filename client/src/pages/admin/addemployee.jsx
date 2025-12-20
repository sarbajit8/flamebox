import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  CreditCard,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Shield,
  Briefcase,
  MapPin,
  IdCard,
  Clock,
  Lock,
  Search,
  Filter,
  Eye,
  EyeOff,
  Info,
  IndianRupee,
} from "lucide-react";
import {
  addEmployee,
  getAllEmployees,
  editEmployee, // Changed from updateEmployee back to editEmployee
  deleteEmployee,
} from "../../store/admin/employee-slice";

const AddEmployee = () => {
  const dispatch = useDispatch();

  // Fixed: Use employee state and correct property name
  const employeeState = useSelector((state) => state?.employee);
  const employeeList = employeeState?.employeeList || [];
  const isLoading = employeeState?.isLoading || false;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

  // Filter and Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "All",
    accessLevel: "All",
    position: "All",
    department: "All",
  });

  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    position: "Trainer",
    department: "Fitness",
    monthlySalary: "",
    hireDate: "",
    address: "",
    emergencyContact: "",
    accessLevel: "Trainer",
    employmentStatus: "Active",
    role: "trainer",
    imageName: "",
  });

  useEffect(() => {
    dispatch(getAllEmployees());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      userName: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      position: "Trainer",
      department: "Fitness",
      monthlySalary: "",
      hireDate: "",
      address: "",
      emergencyContact: "",
      accessLevel: "Trainer",
      employmentStatus: "Active",
      role: "trainer",
      imageName: "",
    });
    setEditMode(false);
    setCurrentEmployeeId(null);
  };

  // Filter and Search Logic
  const filteredEmployees = employeeList.filter((employee) => {
    // Search filter
    const matchesSearch =
      employee.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      filters.status === "All" || employee.employmentStatus === filters.status;

    // Access Level filter
    const matchesAccessLevel =
      filters.accessLevel === "All" ||
      employee.accessLevel === filters.accessLevel;

    // Position filter
    const matchesPosition =
      filters.position === "All" || employee.position === filters.position;

    // Department filter
    const matchesDepartment =
      filters.department === "All" ||
      employee.department === filters.department;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesAccessLevel &&
      matchesPosition &&
      matchesDepartment
    );
  });

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.userName ||
      !formData.fullName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.monthlySalary ||
      !formData.hireDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Password is required for new employees, optional for edits
    if (!editMode && !formData.password) {
      alert("Password is required for new employees");
      return;
    }

    const employeeData = {
      ...formData,
      monthlySalary: Number(formData.monthlySalary),
    };

    // Remove password from update if it's empty (don't update password)
    if (editMode && !formData.password) {
      delete employeeData.password;
    }

    try {
      if (editMode) {
        // Changed from updateEmployee to editEmployee
        await dispatch(
          editEmployee({ id: currentEmployeeId, formData: employeeData })
        ).unwrap();
        alert("Trainer updated successfully!");
      } else {
        console.log("📤 Sending trainer data:", employeeData);
        await dispatch(addEmployee(employeeData)).unwrap();
        alert("Trainer added successfully!");
      }
      resetForm();
      setIsDrawerOpen(false);
      dispatch(getAllEmployees());
    } catch (error) {
      console.error("❌ Error adding trainer:", error);
      alert(error || "Failed to save trainer");
    }
  };

  const handleEdit = (employee) => {
    setFormData({
      userName: employee.userName || "",
      fullName: employee.fullName || "",
      email: employee.email || "",
      phoneNumber: employee.phoneNumber || "",
      password: "", // Leave empty, only update if user enters new password
      position: employee.position || "Trainer",
      department: employee.department || "Fitness",
      monthlySalary: employee.monthlySalary || "",
      hireDate: employee.hireDate
        ? new Date(employee.hireDate).toISOString().split("T")[0]
        : "",
      address: employee.address || "",
      emergencyContact: employee.emergencyContact || "",
      accessLevel: employee.accessLevel || "Trainer",
      employmentStatus: employee.employmentStatus || "Active",
      role: employee.role || "trainer",
      imageName: employee.imageName || "",
    });
    setCurrentEmployeeId(employee._id);
    setEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await dispatch(deleteEmployee(id)).unwrap();
        alert("Employee deleted successfully!");
        dispatch(getAllEmployees());
      } catch (error) {
        alert(error || "Failed to delete employee");
      }
    }
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailsModalOpen(true);
    setShowPassword(false);
  };

  const openAddDrawer = () => {
    resetForm();
    setIsDrawerOpen(true);
  };

  const getPositionColor = (position) => {
    switch (position) {
      case "Manager":
        return "bg-purple-600/20 text-purple-400 border-purple-500/30";
      case "Trainer":
        return "bg-orange-600/20 text-orange-400 border-orange-500/30";
      case "Front Desk":
        return "bg-green-600/20 text-green-400 border-green-500/30";
      case "Maintenance":
        return "bg-blue-600/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-500/30";
    }
  };

  const getAccessLevelColor = (level) => {
    switch (level) {
      case "Full Access":
        return "bg-red-600/20 text-red-400 border-red-500/30";
      case "Admin":
        return "bg-red-600/20 text-red-400 border-red-500/30";
      case "Manager":
        return "bg-blue-600/20 text-blue-400 border-blue-500/30";
      case "Basic (Front Desk)":
        return "bg-green-600/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Gym Employees
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your staff and employee information
            </p>
          </div>
          <button
            onClick={openAddDrawer}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            Add Employee
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Trainers</p>
                <p className="text-3xl font-bold text-white">
                  {employeeList.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Active Staff</p>
                <p className="text-3xl font-bold text-white">
                  {
                    employeeList.filter((e) => e.employmentStatus === "Active")
                      .length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Trainers</p>
                <p className="text-3xl font-bold text-white">
                  {
                    employeeList.filter((e) => e.department === "Fitness")
                      .length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Admin Access</p>
                <p className="text-3xl font-bold text-white">
                  {employeeList.filter((e) => e.accessLevel === "Admin").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-white">
              Search & Filters
            </h3>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by username, full name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>

            {/* Access Level Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Access Level
              </label>
              <select
                value={filters.accessLevel}
                onChange={(e) =>
                  handleFilterChange("accessLevel", e.target.value)
                }
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Access Levels</option>
                <option value="Basic (Front Desk)">Basic (Front Desk)</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
                <option value="Full Access">Full Access</option>
              </select>
            </div>

            {/* Position Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Position
              </label>
              <select
                value={filters.position}
                onChange={(e) => handleFilterChange("position", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Positions</option>
                <option value="Trainer">Trainer</option>
                <option value="Front Desk">Front Desk</option>
                <option value="Manager">Manager</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) =>
                  handleFilterChange("department", e.target.value)
                }
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Departments</option>
                <option value="Fitness">Fitness</option>
                <option value="Administration">Administration</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Sales">Sales</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredEmployees.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white">
                {employeeList.length}
              </span>{" "}
              employees
            </p>
          </div>
        </div>

        {/* Trainers Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">All Trainers</h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-400">
              Loading trainers...
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              {employeeList.length === 0
                ? "No trainers found. Add your first trainer!"
                : "No trainers match your search criteria."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1400px]">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-[200px]">
                      Trainer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-[220px]">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-[140px]">
                      Position
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-[140px]">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-[120px]">
                      Salary
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-[130px]">
                      Hire Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-[160px]">
                      Access Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-[120px]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-[140px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredEmployees.map((employee) => (
                    <tr
                      key={employee._id}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {employee.fullName?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-white truncate">
                              {employee.fullName}
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                              @{employee.userName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300 truncate">
                          {employee.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {employee.phoneNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPositionColor(
                            employee.position
                          )} whitespace-nowrap`}
                        >
                          {employee.position}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300">
                          {employee.department}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-white">
                          ${employee.monthlySalary}
                        </div>
                        <div className="text-xs text-gray-500">monthly</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300">
                          {employee.hireDate
                            ? new Date(employee.hireDate).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getAccessLevelColor(
                            employee.accessLevel
                          )} whitespace-nowrap`}
                        >
                          {employee.accessLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            employee.employmentStatus === "Active"
                              ? "bg-green-600/20 text-green-400"
                              : employee.employmentStatus === "On Leave"
                              ? "bg-yellow-600/20 text-yellow-400"
                              : "bg-gray-600/20 text-gray-400"
                          }`}
                        >
                          {employee.employmentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(employee)}
                            className="p-2 hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Info className="w-4 h-4 text-gray-400 hover:text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleEdit(employee)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit Trainer"
                          >
                            <Edit className="w-4 h-4 text-gray-400 hover:text-white" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee._id)}
                            className="p-2 hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Delete Trainer"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Employee Details Modal */}
      {isDetailsModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                    {selectedEmployee.fullName?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedEmployee.fullName}
                    </h2>
                    <p className="text-blue-100">
                      @{selectedEmployee.userName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    Personal Information
                  </h3>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <label className="text-xs text-gray-400 block mb-1">
                      Username
                    </label>
                    <p className="text-white font-medium">
                      {selectedEmployee.userName}
                    </p>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <label className="text-xs text-gray-400 block mb-1">
                      Full Name
                    </label>
                    <p className="text-white font-medium">
                      {selectedEmployee.fullName}
                    </p>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <label className="text-xs text-gray-400 block mb-1 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <p className="text-white font-medium break-all">
                      {selectedEmployee.email}
                    </p>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <label className="text-xs text-gray-400 block mb-1 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <p className="text-white font-medium">
                      {selectedEmployee.phoneNumber}
                    </p>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <label className="text-xs text-gray-400 block mb-1 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium flex-1">
                        {showPassword ? selectedEmployee.password : "••••••••"}
                      </p>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {selectedEmployee.address && (
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <label className="text-xs text-gray-400 block mb-1 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Address
                      </label>
                      <p className="text-white font-medium">
                        {selectedEmployee.address}
                      </p>
                    </div>
                  )}

                  {selectedEmployee.emergencyContact && (
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <label className="text-xs text-gray-400 block mb-1 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Emergency Contact
                      </label>
                      <p className="text-white font-medium">
                        {selectedEmployee.emergencyContact}
                      </p>
                    </div>
                  )}
                </div>

                {/* Employment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    Employment Information
                  </h3>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <label className="text-xs text-gray-400 block mb-1">
                      Position
                    </label>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getPositionColor(
                        selectedEmployee.position
                      )}`}
                    >
                      {selectedEmployee.position}
                    </span>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <label className="text-xs text-gray-400 block mb-1">
                      Department
                    </label>
                    <p className="text-white font-medium">
                      {selectedEmployee.department}
                    </p>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <label className="text-xs text-gray-400 block mb-1 flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Monthly Salary
                    </label>
                    <p className="text-white font-medium text-xl">
                      ${selectedEmployee.monthlySalary}
                    </p>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <label className="text-xs text-gray-400 block mb-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Hire Date
                    </label>
                    <p className="text-white font-medium">
                      {selectedEmployee.hireDate
                        ? new Date(
                            selectedEmployee.hireDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <label className="text-xs text-gray-400 block mb-1 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Access Level
                    </label>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getAccessLevelColor(
                        selectedEmployee.accessLevel
                      )}`}
                    >
                      {selectedEmployee.accessLevel}
                    </span>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <label className="text-xs text-gray-400 block mb-1 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Employment Status
                    </label>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        selectedEmployee.employmentStatus === "Active"
                          ? "bg-green-600/20 text-green-400"
                          : selectedEmployee.employmentStatus === "On Leave"
                          ? "bg-yellow-600/20 text-yellow-400"
                          : "bg-gray-600/20 text-gray-400"
                      }`}
                    >
                      {selectedEmployee.employmentStatus}
                    </span>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <label className="text-xs text-gray-400 block mb-1">
                      Role
                    </label>
                    <p className="text-white font-medium capitalize">
                      {selectedEmployee.role}
                    </p>
                  </div>

                  {selectedEmployee.createdAt && (
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <label className="text-xs text-gray-400 block mb-1">
                        Created At
                      </label>
                      <p className="text-white font-medium text-sm">
                        {new Date(selectedEmployee.createdAt).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {selectedEmployee.updatedAt && (
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <label className="text-xs text-gray-400 block mb-1">
                        Last Updated
                      </label>
                      <p className="text-white font-medium text-sm">
                        {new Date(selectedEmployee.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-700 bg-gray-750">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setIsDrawerOpen(false);
            resetForm();
          }}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-full sm:w-[500px] bg-gray-800 border-l border-gray-700 shadow-2xl transition-transform duration-300 ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-red-600 to-red-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editMode ? "Edit Trainer" : "Add New Trainer"}
                </h2>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <IdCard className="w-4 h-4 inline mr-2" />
                  Username *
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter username"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter employee's full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="employee@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 234-567-8900"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>

              {/* Position - Fixed to Trainer */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Position
                </label>
                <div className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                  Trainer
                </div>
                <input type="hidden" name="position" value="Trainer" />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Fitness">Fitness</option>
                  <option value="Administration">Administration</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Sales">Sales</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <IndianRupee className="w-4 h-4 inline mr-2" />
                  Monthly Salary *
                </label>
                <input
                  type="number"
                  name="monthlySalary"
                  value={formData.monthlySalary}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="3500"
                />
              </div>

              {/* Hire Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Hire Date *
                </label>
                <input
                  type="date"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter employee's address"
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Emergency Contact
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Emergency contact number"
                />
              </div>

              {/* Access Level - Fixed to Trainer */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Access Level
                </label>
                <div className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                  Trainer
                </div>
                <input type="hidden" name="accessLevel" value="Trainer" />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Employment Status *
                </label>
                <select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50"
                >
                  {isLoading
                    ? "Saving..."
                    : editMode
                    ? "Update Employee"
                    : "Add Employee"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
