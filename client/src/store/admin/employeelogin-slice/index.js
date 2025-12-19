import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null,
  error: null,
};

// Helper to get token from localStorage
const getAuthToken = () => localStorage.getItem("employeeToken");

// ============================================
// EMPLOYEE LOGIN
// ============================================
export const employeeLogin = createAsyncThunk(
  "employeeAuth/employeeLogin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/employee/auth/login`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Store token and user data in localStorage
        localStorage.setItem("employeeToken", response.data.token);
        localStorage.setItem(
          "employeeUser",
          JSON.stringify(response.data.user)
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        "Employee login error:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);

// ============================================
// VERIFY TOKEN
// ============================================
export const verifyEmployeeToken = createAsyncThunk(
  "employeeAuth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue("No token found");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/employee/auth/verify`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update user data in localStorage
      if (response.data.success && response.data.user) {
        localStorage.setItem(
          "employeeUser",
          JSON.stringify(response.data.user)
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        "Token verification error:",
        error.response?.data || error.message
      );
      // Clear localStorage on verification failure
      localStorage.removeItem("employeeToken");
      localStorage.removeItem("employeeUser");
      return rejectWithValue(
        error.response?.data?.error || "Token verification failed"
      );
    }
  }
);

// ============================================
// GET CURRENT EMPLOYEE PROFILE
// ============================================
export const getCurrentEmployeeProfile = createAsyncThunk(
  "employeeAuth/getCurrentProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue("No token found");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/employee/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update user data in localStorage
      if (response.data.success && response.data.user) {
        localStorage.setItem(
          "employeeUser",
          JSON.stringify(response.data.user)
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        "Get profile error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch profile"
      );
    }
  }
);

// ============================================
// EMPLOYEE LOGOUT
// ============================================
export const employeeLogout = createAsyncThunk(
  "employeeAuth/employeeLogout",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (token) {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/employee/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Clear localStorage
      localStorage.removeItem("employeeToken");
      localStorage.removeItem("employeeUser");

      return true;
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      // Clear localStorage even on error
      localStorage.removeItem("employeeToken");
      localStorage.removeItem("employeeUser");

      return rejectWithValue(error.response?.data?.error || "Logout failed");
    }
  }
);

// ============================================
// LOAD USER FROM LOCALSTORAGE (ON APP START)
// ============================================
export const loadEmployeeFromStorage = createAsyncThunk(
  "employeeAuth/loadFromStorage",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = getAuthToken();
      const userString = localStorage.getItem("employeeUser");

      if (!token || !userString) {
        return rejectWithValue("No stored credentials found");
      }

      const user = JSON.parse(userString);

      // Verify token is still valid
      await dispatch(verifyEmployeeToken()).unwrap();

      return { token, user };
    } catch (error) {
      console.error("Load from storage error:", error);
      localStorage.removeItem("employeeToken");
      localStorage.removeItem("employeeUser");
      return rejectWithValue("Failed to load stored credentials");
    }
  }
);

// ============================================
// EMPLOYEE AUTH SLICE
// ============================================
const employeeAuthSlice = createSlice({
  name: "employeeAuth",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Manual logout (without API call)
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("employeeToken");
      localStorage.removeItem("employeeUser");
    },

    // Set credentials manually
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },

    // Update user profile
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("employeeUser", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ============================================
      // EMPLOYEE LOGIN
      // ============================================
      .addCase(employeeLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(employeeLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(employeeLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })

      // ============================================
      // VERIFY TOKEN
      // ============================================
      .addCase(verifyEmployeeToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmployeeToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(verifyEmployeeToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })

      // ============================================
      // GET CURRENT PROFILE
      // ============================================
      .addCase(getCurrentEmployeeProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentEmployeeProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(getCurrentEmployeeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ============================================
      // EMPLOYEE LOGOUT
      // ============================================
      .addCase(employeeLogout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(employeeLogout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(employeeLogout.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      // ============================================
      // LOAD FROM STORAGE
      // ============================================
      .addCase(loadEmployeeFromStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadEmployeeFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loadEmployeeFromStorage.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError, logout, setCredentials, updateUserProfile } =
  employeeAuthSlice.actions;

export default employeeAuthSlice.reducer;
