import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  packages: [],
  activePackages: [],
  featuredPackages: [],
  currentPackage: null,
  packagesByCategory: [],
  statistics: null,
  isLoading: false,
  error: null,
  success: false,
  message: null,
};

// API Base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Session-based fetch options for API calls
const getFetchOptions = (method = "GET", body = null) => {
  const options = {
    method,
    credentials: "include", // Important: Include cookies for session-based auth
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

// Axios config with credentials for session-based auth
const getConfig = () => {
  return {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };
};

// ============================================
// PUBLIC ROUTES - No Authentication Required
// ============================================

// Get All Active Packages (Public)
export const fetchActivePackages = createAsyncThunk(
  "packages/fetchActivePackages",
  async (_, { rejectWithValue }) => {
    try {
      console.log("📦 Fetching active packages...");

      const response = await axios.get(`${API_BASE_URL}/api/packages/active`, {
        withCredentials: true
      });

      console.log("✅ Active packages fetched:", response.data.count);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Fetch active packages error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch active packages"
      );
    }
  }
);

// Get Featured Packages (Public)
export const fetchFeaturedPackages = createAsyncThunk(
  "packages/fetchFeaturedPackages",
  async (_, { rejectWithValue }) => {
    try {
      console.log("⭐ Fetching featured packages...");

      const response = await axios.get(`${API_BASE_URL}/api/packages/featured`, {
        withCredentials: true
      });

      console.log("✅ Featured packages fetched:", response.data.count);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Fetch featured packages error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch featured packages"
      );
    }
  }
);

// Get Packages By Category (Public)
export const fetchPackagesByCategory = createAsyncThunk(
  "packages/fetchPackagesByCategory",
  async (category, { rejectWithValue }) => {
    try {
      console.log(`📂 Fetching packages for category: ${category}`);

      const response = await axios.get(
        `${API_BASE_URL}/api/packages/category/${category}`,
        {
          withCredentials: true
        }
      );

      console.log("✅ Packages by category fetched:", response.data.count);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Fetch packages by category error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch packages by category"
      );
    }
  }
);

// Get Package By ID (Public)
export const fetchPublicPackageById = createAsyncThunk(
  "packages/fetchPublicPackageById",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`🔍 Fetching public package ID: ${id}`);

      const response = await axios.get(
        `${API_BASE_URL}/api/packages/public/${id}`,
        {
          withCredentials: true
        }
      );

      console.log(
        "✅ Public package fetched:",
        response.data.package.packageName
      );
      return response.data;
    } catch (error) {
      console.error(
        "❌ Fetch public package error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch package"
      );
    }
  }
);

// ============================================
// ADMIN ROUTES - NO AUTH FOR TESTING
// ============================================

// Get All Packages (Admin View with Filters)
export const fetchAllPackages = createAsyncThunk(
  "packages/fetchAllPackages",
  async (filters = {}, { rejectWithValue }) => {
    try {
      console.log("📦 Fetching all packages with filters:", filters);

      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.packageType)
        queryParams.append("packageType", filters.packageType);
      if (filters.isActive !== undefined)
        queryParams.append("isActive", filters.isActive);

      const response = await fetch(
        `${API_BASE_URL}/api/packages/?${queryParams.toString()}`,
        getFetchOptions("GET")
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ All packages fetched:", data.count);
      return data;
    } catch (error) {
      console.error(
        "❌ Fetch all packages error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch packages"
      );
    }
  }
);

// Get Package By ID
export const fetchPackageById = createAsyncThunk(
  "packages/fetchPackageById",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`🔍 Fetching package ID: ${id}`);

      const response = await axios.get(
        `${API_BASE_URL}/api/packages/${id}`,
        getConfig()
      );

      console.log("✅ Package fetched:", response.data.package.packageName);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Fetch package error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch package"
      );
    }
  }
);

// Get Package Statistics
export const fetchPackageStatistics = createAsyncThunk(
  "packages/fetchPackageStatistics",
  async (_, { rejectWithValue }) => {
    try {
      console.log("📊 Fetching package statistics...");

      const response = await axios.get(
        `${API_BASE_URL}/api/packages/statistics`,
        getConfig()
      );

      console.log("✅ Statistics fetched");
      return response.data;
    } catch (error) {
      console.error(
        "❌ Fetch statistics error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch statistics"
      );
    }
  }
);

// ============================================
// CREATE OPERATIONS
// ============================================

// Create New Package
export const createPackage = createAsyncThunk(
  "packages/createPackage",
  async (packageData, { rejectWithValue }) => {
    try {
      console.log("➕ Creating new package:", packageData.packageName);
      console.log("📦 Package data:", packageData);

      const response = await axios.post(
        `${API_BASE_URL}/api/packages/`,
        packageData,
        getConfig()
      );

      console.log("✅ Package created:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Create package error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to create package"
      );
    }
  }
);

// Duplicate Package
export const duplicatePackage = createAsyncThunk(
  "packages/duplicatePackage",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`📋 Duplicating package ID: ${id}`);

      const response = await axios.post(
        `${API_BASE_URL}/api/packages/${id}/duplicate`,
        {},
        getConfig()
      );

      console.log("✅ Package duplicated:", response.data.package.packageName);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Duplicate package error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to duplicate package"
      );
    }
  }
);

// ============================================
// UPDATE OPERATIONS
// ============================================

// Update Package
export const updatePackage = createAsyncThunk(
  "packages/updatePackage",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      console.log(`📝 Updating package ID: ${id}`);

      const response = await axios.put(
        `${API_BASE_URL}/api/packages/${id}`,
        updateData,
        getConfig()
      );

      console.log("✅ Package updated:", response.data.package.packageName);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Update package error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to update package"
      );
    }
  }
);

// Toggle Package Status
export const togglePackageStatus = createAsyncThunk(
  "packages/togglePackageStatus",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`🔄 Toggling package status ID: ${id}`);

      const response = await axios.patch(
        `${API_BASE_URL}/api/packages/${id}/toggle`,
        {},
        getConfig()
      );

      console.log("✅ Package status toggled:", response.data.message);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Toggle status error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to toggle package status"
      );
    }
  }
);

// Update Display Order
export const updateDisplayOrder = createAsyncThunk(
  "packages/updateDisplayOrder",
  async (packagesArray, { rejectWithValue }) => {
    try {
      console.log(
        `🔢 Updating display order for ${packagesArray.length} packages`
      );

      const response = await axios.put(
        `${API_BASE_URL}/api/packages/display-order/update`,
        { packages: packagesArray },
        getConfig()
      );

      console.log("✅ Display order updated");
      return response.data;
    } catch (error) {
      console.error(
        "❌ Update display order error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to update display order"
      );
    }
  }
);

// ============================================
// DELETE OPERATIONS
// ============================================

// Delete Package
export const deletePackage = createAsyncThunk(
  "packages/deletePackage",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`🗑️ Deleting package ID: ${id}`);

      const response = await axios.delete(
        `${API_BASE_URL}/api/packages/${id}`,
        getConfig()
      );

      console.log("✅ Package deleted");
      return { ...response.data, deletedId: id };
    } catch (error) {
      console.error(
        "❌ Delete package error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete package"
      );
    }
  }
);

// Bulk Delete Packages
export const bulkDeletePackages = createAsyncThunk(
  "packages/bulkDeletePackages",
  async (ids, { rejectWithValue }) => {
    try {
      console.log(`🗑️ Bulk deleting ${ids.length} packages`);

      const response = await axios.post(
        `${API_BASE_URL}/api/packages/bulk-delete`,
        { ids },
        getConfig()
      );

      console.log("✅ Packages deleted:", response.data.deletedCount);
      return { ...response.data, deletedIds: ids };
    } catch (error) {
      console.error(
        "❌ Bulk delete error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete packages"
      );
    }
  }
);

// ============================================
// PACKAGES SLICE
// ============================================
const packagesSlice = createSlice({
  name: "packages",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
    clearCurrentPackage: (state) => {
      state.currentPackage = null;
    },
    resetPackagesState: (state) => {
      state.packages = [];
      state.activePackages = [];
      state.featuredPackages = [];
      state.currentPackage = null;
      state.packagesByCategory = [];
      state.statistics = null;
      state.isLoading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivePackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActivePackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activePackages = action.payload.packages;
        state.error = null;
      })
      .addCase(fetchActivePackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedPackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedPackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredPackages = action.payload.packages;
        state.error = null;
      })
      .addCase(fetchFeaturedPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPackagesByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPackagesByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.packagesByCategory = action.payload.packages;
        state.error = null;
      })
      .addCase(fetchPackagesByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPublicPackageById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicPackageById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPackage = action.payload.package;
        state.error = null;
      })
      .addCase(fetchPublicPackageById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllPackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.packages = action.payload.packages;
        state.error = null;
      })
      .addCase(fetchAllPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPackageById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPackageById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPackage = action.payload.package;
        state.error = null;
      })
      .addCase(fetchPackageById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPackageStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPackageStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statistics = action.payload.statistics;
        state.error = null;
      })
      .addCase(fetchPackageStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createPackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.packages.push(action.payload.package);
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(duplicatePackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(duplicatePackage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.packages.push(action.payload.package);
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(duplicatePackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(updatePackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.packages.findIndex(
          (pkg) => pkg._id === action.payload.package._id
        );
        if (index !== -1) {
          state.packages[index] = action.payload.package;
        }
        state.currentPackage = action.payload.package;
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(togglePackageStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(togglePackageStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.packages.findIndex(
          (pkg) => pkg._id === action.payload.package._id
        );
        if (index !== -1) {
          state.packages[index] = action.payload.package;
        }
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(togglePackageStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateDisplayOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDisplayOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateDisplayOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deletePackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.packages = state.packages.filter(
          (pkg) => pkg._id !== action.payload.deletedId
        );
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(bulkDeletePackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(bulkDeletePackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.packages = state.packages.filter(
          (pkg) => !action.payload.deletedIds.includes(pkg._id)
        );
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(bulkDeletePackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  clearCurrentPackage,
  resetPackagesState,
} = packagesSlice.actions;

export default packagesSlice.reducer;
