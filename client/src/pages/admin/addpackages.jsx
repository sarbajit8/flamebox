import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  Package,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Star,
  Clock,
  Zap,
  Crown,
  Target,
  Activity,
  Shield,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  fetchAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
  togglePackageStatus,
  clearError,
  clearSuccess,
} from "../../store/admin/packages-slice";
import PackageFeaturesManager from "../../components/admin/PackageFeaturesManager";

const AddPackages = () => {
  const dispatch = useDispatch();
  const { packages, isLoading, error, success, message } = useSelector(
    (state) => state.packages
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPackageId, setCurrentPackageId] = useState(null);
  const [isFeaturesManagerOpen, setIsFeaturesManagerOpen] = useState(false);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [formData, setFormData] = useState({
    packageName: "",
    packageType: "Membership",
    duration: { value: "", unit: "Months" },
    originalPrice: "",
    discountedPrice: "",
    discountType: "flat",
    freezable: false,
    sessions: "Unlimited",
    sessionCount: null,
    features: [],
    status: "Active",
    isActive: true,
    description: "",
    category: "Basic",
    maxMembers: 1,
    amenities: {
      gymAccess: true,
      lockerRoom: true,
      basicEquipment: true,
      premiumEquipment: false,
      groupClasses: false,
      personalTrainer: false,
      nutritionPlan: false,
      sauna: false,
      steamRoom: false,
      swimmingPool: false,
      spa: false,
      dietConsultation: false,
      guestPass: false,
    },
    isFeatured: false,
    badge: "",
    popularity: 0,
    displayOrder: 0,
  });

  // Fetch available features from backend
  const fetchFeatures = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/package/features`,
        {
          credentials: 'include'
        }
      );
      const data = await response.json();
      if (data.success) {
        setAvailableFeatures(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch features:", error);
    }
  };

  // Fetch packages and features on component mount
  useEffect(() => {
    dispatch(fetchAllPackages());
    fetchFeatures();
  }, [dispatch]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "durationValue" || name === "durationUnit") {
      setFormData((prev) => ({
        ...prev,
        duration: {
          ...prev.duration,
          [name === "durationValue" ? "value" : "unit"]:
            name === "durationValue" ? parseInt(value) || "" : value,
        },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity],
      },
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const resetForm = () => {
    setFormData({
      packageName: "",
      packageType: "Membership",
      duration: { value: "", unit: "Months" },
      originalPrice: "",
      discountedPrice: "",
      discountType: "flat",
      freezable: false,
      sessions: "Unlimited",
      sessionCount: null,
      features: [],
      status: "Active",
      isActive: true,
      description: "",
      category: "Basic",
      maxMembers: 1,
      amenities: {
        gymAccess: true,
        lockerRoom: true,
        basicEquipment: true,
        premiumEquipment: false,
        groupClasses: false,
        personalTrainer: false,
        nutritionPlan: false,
        sauna: false,
        steamRoom: false,
        swimmingPool: false,
        spa: false,
        dietConsultation: false,
        guestPass: false,
      },
      isFeatured: false,
      badge: "",
      popularity: 0,
      displayOrder: 0,
    });
    setEditMode(false);
    setCurrentPackageId(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (
      !formData.packageName ||
      !formData.duration.value ||
      !formData.originalPrice ||
      !formData.discountedPrice
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (editMode && currentPackageId) {
        // Update existing package
        await dispatch(
          updatePackage({
            id: currentPackageId,
            updateData: formData,
          })
        ).unwrap();
      } else {
        // Create new package
        await dispatch(createPackage(formData)).unwrap();
      }

      resetForm();
      setIsDrawerOpen(false);
      dispatch(fetchAllPackages()); // Refresh list
    } catch (err) {
      console.error("Error submitting package:", err);
    }
  };

  const handleEdit = (pkg) => {
    setEditMode(true);
    setCurrentPackageId(pkg._id);
    setFormData({
      packageName: pkg.packageName,
      packageType: pkg.packageType,
      duration: pkg.duration,
      originalPrice: pkg.originalPrice,
      discountedPrice: pkg.discountedPrice,
      discountType: pkg.discountType || "flat",
      freezable: pkg.freezable || false,
      sessions: pkg.sessions,
      sessionCount: pkg.sessionCount,
      features: pkg.features || [],
      status: pkg.status,
      isActive: pkg.isActive,
      description: pkg.description,
      category: pkg.category,
      maxMembers: pkg.maxMembers,
      amenities: pkg.amenities || {
        gymAccess: true,
        lockerRoom: true,
        basicEquipment: true,
        premiumEquipment: false,
        groupClasses: false,
        personalTrainer: false,
        nutritionPlan: false,
        sauna: false,
        steamRoom: false,
        swimmingPool: false,
        spa: false,
        dietConsultation: false,
        guestPass: false,
      },
      isFeatured: pkg.isFeatured || false,
      badge: pkg.badge || "",
      popularity: pkg.popularity || 0,
      displayOrder: pkg.displayOrder || 0,
    });
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await dispatch(deletePackage(id)).unwrap();
        dispatch(fetchAllPackages()); // Refresh list
      } catch (err) {
        console.error("Error deleting package:", err);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await dispatch(togglePackageStatus(id)).unwrap();
      dispatch(fetchAllPackages()); // Refresh list
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "VIP":
        return "bg-gradient-to-r from-purple-600 to-pink-600";
      case "Premium":
        return "bg-gradient-to-r from-red-600 to-red-700";
      case "Training":
        return "bg-gradient-to-r from-blue-600 to-blue-700";
      case "Class":
        return "bg-gradient-to-r from-green-600 to-green-700";
      case "Group":
        return "bg-gradient-to-r from-orange-600 to-orange-700";
      default:
        return "bg-gradient-to-r from-gray-600 to-gray-700";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "VIP":
        return <Crown className="w-4 h-4" />;
      case "Premium":
        return <Sparkles className="w-4 h-4" />;
      case "Training":
        return <Target className="w-4 h-4" />;
      case "Class":
        return <Users className="w-4 h-4" />;
      case "Group":
        return <Activity className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Membership":
        return "bg-blue-600/20 text-blue-400 border-blue-500/30";
      case "Personal Training":
        return "bg-green-600/20 text-green-400 border-green-500/30";
      case "Group Classes":
        return "bg-purple-600/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-500/30";
    }
  };

  // Calculate stats
  const stats = {
    total: packages.length,
    active: packages.filter((p) => p.isActive && p.status === "Active").length,
    membership: packages.filter((p) => p.packageType === "Membership").length,
    training: packages.filter((p) => p.packageType === "Personal Training")
      .length,
  };

  if (isLoading && packages.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading Packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 sm:p-2 lg:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Gym Packages
            </h1>
            <p className="text-gray-400 text-sm">
              Manage membership plans and service packages
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsFeaturesManagerOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <Package className="w-4 h-4" />
              Package Features
            </button>
            <button
              onClick={() => {
                resetForm();
                setIsDrawerOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Add Package
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-500 font-semibold">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-500 font-semibold">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Packages</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Active Packages</p>
                <p className="text-3xl font-bold text-white">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Membership Plans</p>
                <p className="text-3xl font-bold text-white">
                  {stats.membership}
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
                <p className="text-gray-400 text-sm mb-1">Training Packages</p>
                <p className="text-3xl font-bold text-white">
                  {stats.training}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
              >
                {/* Package Header */}
                <div
                  className={`p-3 text-white ${getCategoryColor(pkg.category)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(pkg.category)}
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {pkg.category}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleStatus(pkg._id)}
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                        pkg.isActive && pkg.status === "Active"
                          ? "bg-green-500/20 text-green-200 hover:bg-green-500/30"
                          : "bg-gray-500/20 text-gray-200 hover:bg-gray-500/30"
                      }`}
                    >
                      {pkg.status}
                    </button>
                  </div>
                  <h3 className="text-sm font-bold mb-0.5 truncate">{pkg.packageName}</h3>
                  <p className="text-white/80 text-xs line-clamp-2">{pkg.description}</p>
                </div>

                {/* Package Body */}
                <div className="p-3">
                  {/* Price */}
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    <div className="text-lg font-bold text-white">
                      ₹{pkg.discountedPrice}
                    </div>
                    {pkg.originalPrice && (
                      <>
                        <div className="text-xs text-gray-400 line-through">
                          ₹{pkg.originalPrice}
                        </div>
                        <div className="px-1.5 py-0.5 bg-green-600/20 text-green-400 rounded text-[10px] font-semibold">
                          Save ₹{pkg.savings}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Duration
                      </span>
                      <span className="text-white font-medium text-[11px]">
                        {pkg.duration.value} {pkg.duration.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Sessions
                      </span>
                      <span className="text-white font-medium text-[11px]">
                        {pkg.sessions}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Max Members
                      </span>
                      <span className="text-white font-medium text-[11px]">
                        {pkg.maxMembers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Type</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${getTypeColor(
                          pkg.packageType
                        )}`}
                      >
                        {pkg.packageType}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  {pkg.features && pkg.features.length > 0 && (
                    <div className="mb-2">
                      <h4 className="text-xs font-semibold text-gray-300 mb-1">
                        Features:
                      </h4>
                      <div className="space-y-0.5">
                        {pkg.features.slice(0, 2).map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 text-[11px] text-gray-300"
                          >
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}
                        {pkg.features.length > 2 && (
                          <div className="text-[10px] text-gray-500">
                            +{pkg.features.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-gray-700">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="flex-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="px-2 py-1.5 bg-gray-700 hover:bg-red-600 text-white rounded text-xs font-semibold transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No Packages Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first gym package to get started
            </p>
            <button
              onClick={() => {
                resetForm();
                setIsDrawerOpen(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              Create Package
            </button>
          </div>
        )}
      </div>

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
          className={`absolute right-0 top-0 h-full w-full sm:w-[600px] bg-gray-800 border-l border-gray-700 shadow-2xl transition-transform duration-300 ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-red-600 to-red-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editMode ? "Edit Package" : "Create New Package"}
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
              {/* Package Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Package className="w-4 h-4 inline mr-2" />
                  Package Name *
                </label>
                <input
                  type="text"
                  name="packageName"
                  value={formData.packageName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Premium Membership, Personal Training"
                />
              </div>

              {/* Package Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Package Type *
                </label>
                <select
                  name="packageType"
                  value={formData.packageType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Membership">Membership</option>
                  <option value="Personal Training">Personal Training</option>
                  <option value="Group Classes">Group Classes</option>
                  <option value="Day Pass">Day Pass</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Special">Special Offer</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Star className="w-4 h-4 inline mr-2" />
                  Package Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe the package benefits and features..."
                />
              </div>

              {/* Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Duration Value *
                  </label>
                  <input
                    type="number"
                    name="durationValue"
                    value={formData.duration.value}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 6, 12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Duration Unit *
                  </label>
                  <select
                    name="durationUnit"
                    value={formData.duration.unit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                    <option value="Months">Months</option>
                    <option value="Years">Years</option>
                  </select>
                </div>
              </div>

              {/* Sessions */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Zap className="w-4 h-4 inline mr-2" />
                  Sessions *
                </label>
                <input
                  type="text"
                  name="sessions"
                  value={formData.sessions}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Unlimited, 12 Sessions"
                />
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Original Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="1440"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Discounted Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="1200"
                  />
                </div>
              </div>

              {/* Discount Type & Freezable */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Discount Type *
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="flat">Flat Amount</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Freezable *
                  </label>
                  <select
                    name="freezable"
                    value={formData.freezable}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        freezable: e.target.value === "true",
                      }))
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              {/* Max Members */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Maximum Members *
                </label>
                <input
                  type="number"
                  name="maxMembers"
                  value={formData.maxMembers}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="1"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Package Features
                </label>
                <div className="space-y-3">
                  <select
                    onChange={(e) => {
                      const selectedFeature = e.target.value;
                      if (
                        selectedFeature &&
                        !formData.features.includes(selectedFeature)
                      ) {
                        setFormData((prev) => ({
                          ...prev,
                          features: [...prev.features, selectedFeature],
                        }));
                      }
                      e.target.value = ""; // Reset selection
                    }}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                        '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10L12 15L17 10H7Z" fill="white"/></svg>'
                      )}")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      backgroundSize: "16px",
                      paddingRight: "40px",
                    }}
                  >
                    <option value="">Select a feature to add...</option>
                    {availableFeatures
                      .filter(
                        (feature) => !formData.features.includes(feature.name)
                      )
                      .map((feature) => (
                        <option key={feature._id} value={feature.name}>
                          {feature.name}
                        </option>
                      ))}
                  </select>

                  {/* Selected Features */}
                  {formData.features.length > 0 && (
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-2">
                        Selected Features:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600/20 text-purple-300 text-sm rounded-full border border-purple-500/30"
                          >
                            {feature}
                            <button
                              type="button"
                              onClick={() => handleFeatureToggle(feature)}
                              className="ml-1 text-purple-400 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Featured */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Package Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer hover:bg-gray-700/50 p-3 rounded w-full">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <Star className="w-4 h-4" />
                    Featured Package
                  </label>
                </div>
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
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {editMode ? "Updating..." : "Creating..."}
                    </>
                  ) : editMode ? (
                    "Update Package"
                  ) : (
                    "Create Package"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Package Features Manager Modal */}
      <PackageFeaturesManager
        isOpen={isFeaturesManagerOpen}
        onClose={() => {
          setIsFeaturesManagerOpen(false);
          fetchFeatures(); // Refresh features when closing
        }}
      />
    </div>
  );
};

export default AddPackages;
