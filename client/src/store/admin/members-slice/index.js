import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  members: [],
  activeMembers: [],
  expiringMembers: [],
  currentMember: null,
  statistics: null,
  isLoading: false,
  error: null,
  success: false,
  message: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalMembers: 0,
    limit: 10,
  },
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

// Axios config for session-based auth
const getConfig = () => {
  return {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };
};

// ============================================
// PUBLIC ROUTES
// ============================================

// Get Active Members
export const fetchActiveMembers = createAsyncThunk(
  "members/fetchActiveMembers",
  async (_, { rejectWithValue }) => {
    try {
      console.log("✅ Fetching active members...");

      const response = await fetch(
        `${API_BASE_URL}/api/members/active`,
        getFetchOptions("GET")
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Active members fetched:", data.count);
      return data;
    } catch (error) {
      console.error(
        "❌ Fetch active members error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch active members"
      );
    }
  }
);

// Get Expiring Memberships
export const fetchExpiringMemberships = createAsyncThunk(
  "members/fetchExpiringMemberships",
  async (days = 7, { rejectWithValue }) => {
    try {
      console.log(`⏰ Fetching memberships expiring in ${days} days...`);

      const response = await fetch(
        `${API_BASE_URL}/api/members/expiring?days=${days}`,
        getFetchOptions("GET")
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Expiring memberships fetched:", data.count);
      return data;
    } catch (error) {
      console.error(
        "❌ Fetch expiring memberships error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch expiring memberships"
      );
    }
  }
);

// Get Member Statistics
export const fetchMemberStatistics = createAsyncThunk(
  "members/fetchMemberStatistics",
  async (_, { rejectWithValue }) => {
    try {
      console.log("📊 Fetching member statistics...");

      const response = await fetch(
        `${API_BASE_URL}/api/members/statistics`,
        getFetchOptions("GET")
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Statistics fetched");
      return data;
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
// MEMBER CRUD OPERATIONS
// ============================================

// Get All Members with Filters
export const fetchAllMembers = createAsyncThunk(
  "members/fetchAllMembers",
  async (filters = {}, { rejectWithValue }) => {
    try {
      console.log("📋 Fetching all members with filters:", filters);

      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.vaccinationStatus)
        queryParams.append("vaccinationStatus", filters.vaccinationStatus);
      if (filters.packageStatus)
        queryParams.append("packageStatus", filters.packageStatus);
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.page) queryParams.append("page", filters.page);
      if (filters.limit) queryParams.append("limit", filters.limit);
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
      if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

      const response = await fetch(
        `${API_BASE_URL}/api/members/all?${queryParams.toString()}`,
        getFetchOptions("GET")
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log("✅ Members fetched:", data.count);
      return data;
    } catch (error) {
      console.error(
        "❌ Fetch members error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch members"
      );
    }
  }
);

// Get Member By ID
export const fetchMemberById = createAsyncThunk(
  "members/fetchMemberById",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`🔍 Fetching member ID: ${id}`);

      const response = await axios.get(
        `${API_BASE_URL}/api/members/${id}`,
        getConfig()
      );

      console.log("✅ Member fetched:", response.data.member.fullName);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Fetch member error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch member"
      );
    }
  }
);

// Get Member By Registration Number
export const fetchMemberByRegistrationNumber = createAsyncThunk(
  "members/fetchMemberByRegistrationNumber",
  async (registrationNumber, { rejectWithValue }) => {
    try {
      console.log(
        `🔍 Fetching member by registration number: ${registrationNumber}`
      );

      const response = await axios.get(
        `${API_BASE_URL}/api/members/registration/${registrationNumber}`,
        getConfig()
      );

      console.log("✅ Member fetched:", response.data.member.fullName);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Fetch member error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch member"
      );
    }
  }
);

// Create Member
export const createMember = createAsyncThunk(
  "members/createMember",
  async (memberData, { rejectWithValue }) => {
    try {
      console.log("➕ Creating new member:", memberData.fullName);
      console.log("📦 Member data:", memberData);

      const response = await fetch(
        `${API_BASE_URL}/api/members`,
        getFetchOptions("POST", memberData)
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create member");
      }

      const data = await response.json();
      console.log("✅ Member created:", data);
      return data;
    } catch (error) {
      console.error("❌ Create member error:", error.message);
      return rejectWithValue(error.message || "Failed to create member");
    }
  }
);

// Update Member
export const updateMember = createAsyncThunk(
  "members/updateMember",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      console.log(`📝 Updating member ID: ${id}`);

      const response = await fetch(
        `${API_BASE_URL}/api/members/${id}`,
        getFetchOptions("PUT", updateData)
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update member");
      }

      const data = await response.json();
      console.log("✅ Member updated:", data.member.fullName);
      return data;
    } catch (error) {
      console.error("❌ Update member error:", error.message);
      return rejectWithValue(error.message || "Failed to update member");
    }
  }
);

// Delete Member (Soft Delete)
export const deleteMember = createAsyncThunk(
  "members/deleteMember",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`🗑️ Deleting member ID: ${id}`);

      const response = await axios.delete(
        `${API_BASE_URL}/api/members/${id}`,
        getConfig()
      );

      console.log("✅ Member deleted");
      return { ...response.data, deletedId: id };
    } catch (error) {
      console.error(
        "❌ Delete member error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete member"
      );
    }
  }
);

// Restore Member
export const restoreMember = createAsyncThunk(
  "members/restoreMember",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`♻️ Restoring member ID: ${id}`);

      const response = await axios.patch(
        `${API_BASE_URL}/api/members/${id}/restore`,
        {},
        getConfig()
      );

      console.log("✅ Member restored:", response.data.member.fullName);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Restore member error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to restore member"
      );
    }
  }
);

// Bulk Delete Members
export const bulkDeleteMembers = createAsyncThunk(
  "members/bulkDeleteMembers",
  async (ids, { rejectWithValue }) => {
    try {
      console.log(`🗑️ Bulk deleting ${ids.length} members`);

      const response = await axios.post(
        `${API_BASE_URL}/api/members/bulk-delete`,
        { ids },
        getConfig()
      );

      console.log("✅ Members deleted:", response.data.deletedCount);
      return { ...response.data, deletedIds: ids };
    } catch (error) {
      console.error(
        "❌ Bulk delete error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete members"
      );
    }
  }
);

// ============================================
// PACKAGE MANAGEMENT
// ============================================

// Add Package to Member
export const addPackageToMember = createAsyncThunk(
  "members/addPackageToMember",
  async ({ memberId, packageData }, { rejectWithValue }) => {
    try {
      console.log(`📦 Adding package to member ID: ${memberId}`);

      const response = await axios.post(
        `${API_BASE_URL}/api/members/${memberId}/packages`,
        packageData,
        getConfig()
      );

      console.log("✅ Package added to member");
      return response.data;
    } catch (error) {
      console.error(
        "❌ Add package error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to add package"
      );
    }
  }
);

// Update Package Status
export const updatePackageStatus = createAsyncThunk(
  "members/updatePackageStatus",
  async ({ memberId, packageId, status }, { rejectWithValue }) => {
    try {
      console.log(`🔄 Updating package status for member: ${memberId}`);

      const response = await axios.patch(
        `${API_BASE_URL}/api/members/${memberId}/packages/${packageId}/status`,
        { status },
        getConfig()
      );

      console.log("✅ Package status updated");
      return response.data;
    } catch (error) {
      console.error(
        "❌ Update package status error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to update package status"
      );
    }
  }
);

// ============================================
// PAYMENT OPERATIONS
// ============================================

// Add Payment
export const addPayment = createAsyncThunk(
  "members/addPayment",
  async ({ memberId, paymentData }, { rejectWithValue }) => {
    try {
      console.log(`💰 Adding payment for member ID: ${memberId}`);

      const response = await axios.post(
        `${API_BASE_URL}/api/members/${memberId}/payments`,
        paymentData,
        getConfig()
      );

      console.log("✅ Payment added");
      return response.data;
    } catch (error) {
      console.error(
        "❌ Add payment error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to add payment"
      );
    }
  }
);

// ============================================
// ATTENDANCE OPERATIONS
// ============================================

// Record Attendance
export const recordAttendance = createAsyncThunk(
  "members/recordAttendance",
  async ({ memberId, attendanceData }, { rejectWithValue }) => {
    try {
      console.log(`📅 Recording attendance for member ID: ${memberId}`);

      const response = await axios.post(
        `${API_BASE_URL}/api/members/${memberId}/attendance`,
        attendanceData,
        getConfig()
      );

      console.log("✅ Attendance recorded");
      return response.data;
    } catch (error) {
      console.error(
        "❌ Record attendance error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to record attendance"
      );
    }
  }
);

// ============================================
// MEMBERS SLICE
// ============================================
const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
    clearCurrentMember: (state) => {
      state.currentMember = null;
    },
    resetMembersState: (state) => {
      state.members = [];
      state.activeMembers = [];
      state.expiringMembers = [];
      state.currentMember = null;
      state.statistics = null;
      state.isLoading = false;
      state.error = null;
      state.success = false;
      state.message = null;
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalMembers: 0,
        limit: 10,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Active Members
      .addCase(fetchActiveMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeMembers = action.payload.members;
        state.error = null;
      })
      .addCase(fetchActiveMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Expiring Memberships
      .addCase(fetchExpiringMemberships.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpiringMemberships.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expiringMembers = action.payload.members;
        state.error = null;
      })
      .addCase(fetchExpiringMemberships.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Member Statistics
      .addCase(fetchMemberStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMemberStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statistics = action.payload.statistics;
        state.error = null;
      })
      .addCase(fetchMemberStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch All Members
      .addCase(fetchAllMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members = action.payload.members;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalMembers: action.payload.totalMembers,
          limit: action.payload.members.length,
        };
        state.error = null;
      })
      .addCase(fetchAllMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Member By ID
      .addCase(fetchMemberById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMemberById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMember = action.payload.member;
        state.error = null;
      })
      .addCase(fetchMemberById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Member By Registration Number
      .addCase(fetchMemberByRegistrationNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMemberByRegistrationNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMember = action.payload.member;
        state.error = null;
      })
      .addCase(fetchMemberByRegistrationNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create Member
      .addCase(createMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members.push(action.payload.member);
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(createMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update Member
      .addCase(updateMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.members.findIndex(
          (member) => member._id === action.payload.member._id
        );
        if (index !== -1) {
          state.members[index] = action.payload.member;
        }
        state.currentMember = action.payload.member;
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete Member
      .addCase(deleteMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members = state.members.filter(
          (member) => member._id !== action.payload.deletedId
        );
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Restore Member
      .addCase(restoreMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(restoreMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members.push(action.payload.member);
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(restoreMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Bulk Delete Members
      .addCase(bulkDeleteMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(bulkDeleteMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members = state.members.filter(
          (member) => !action.payload.deletedIds.includes(member._id)
        );
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(bulkDeleteMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Add Package to Member
      .addCase(addPackageToMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addPackageToMember.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.members.findIndex(
          (member) => member._id === action.payload.member._id
        );
        if (index !== -1) {
          state.members[index] = action.payload.member;
        }
        state.currentMember = action.payload.member;
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(addPackageToMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update Package Status
      .addCase(updatePackageStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePackageStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.members.findIndex(
          (member) => member._id === action.payload.member._id
        );
        if (index !== -1) {
          state.members[index] = action.payload.member;
        }
        state.currentMember = action.payload.member;
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updatePackageStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add Payment
      .addCase(addPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.members.findIndex(
          (member) => member._id === action.payload.member._id
        );
        if (index !== -1) {
          state.members[index] = action.payload.member;
        }
        state.currentMember = action.payload.member;
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Record Attendance
      .addCase(recordAttendance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(recordAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.members.findIndex(
          (member) => member._id === action.payload.member._id
        );
        if (index !== -1) {
          state.members[index] = action.payload.member;
        }
        state.currentMember = action.payload.member;
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(recordAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  clearCurrentMember,
  resetMembersState,
} = membersSlice.actions;

export default membersSlice.reducer;
