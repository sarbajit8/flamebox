import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
}/api/auth/users`;

const TRAINER_API_BASE_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
}/api/auth/trainer`;

// Helper function to get fetch options with credentials (for session cookies)
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

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ emailOrPhone, password, role }, { rejectWithValue }) => {
    try {
      console.log("🔐 Attempting login...", { emailOrPhone, role });
      const response = await fetch(
        `${API_BASE_URL}/login`,
        getFetchOptions("POST", { emailOrPhone, password, role })
      );

      console.log("📡 Login response status:", response.status);
      console.log("🍪 Response headers:", [...response.headers.entries()]);

      const data = await response.json();
      console.log("📦 Login response data:", data);

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      // Store user in localStorage (session is handled by cookies now)
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("✅ User stored in localStorage");

      return data;
    } catch (error) {
      console.error("❌ Login error:", error);
      return rejectWithValue("Network error. Please try again.");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      // Send logout request with session cookie
      const response = await fetch(
        `${API_BASE_URL}/logout`,
        getFetchOptions("POST")
      );

      const data = await response.json();
      if (!data.success) {
        console.warn(
          "Logout request failed on server, but clearing local storage anyway"
        );
      }

      // Clear local storage (session cookie is cleared by server)
      localStorage.removeItem("user");

      return { success: true };
    } catch (error) {
      // Still clear local storage even if server request fails
      localStorage.removeItem("user");
      return { success: true };
    }
  }
);

export const logoutAllDevices = createAsyncThunk(
  "auth/logoutAllDevices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/logout-all`,
        getFetchOptions("POST")
      );

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("user");

      return data;
    } catch (error) {
      // Still clear local storage even if server request fails
      localStorage.removeItem("token");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("user");
      return rejectWithValue("Network error during logout");
    }
  }
);

export const verifySession = createAsyncThunk(
  "auth/verifySession",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔍 Verifying session with server...");
      const response = await fetch(
        `${API_BASE_URL}/verify`,
        getFetchOptions("GET")
      );

      console.log("📡 Verify response status:", response.status);
      const data = await response.json();
      console.log("📦 Verify response data:", data);

      if (!data.success) {
        // Invalid session, clear local storage
        console.error("❌ Session verification failed:", data.error);
        localStorage.removeItem("user");
        return rejectWithValue(data.error);
      }

      console.log(
        "✅ Session verified successfully for user:",
        data.user.email
      );
      return data.user;
    } catch (error) {
      // Network error or invalid response, clear local storage
      console.error("❌ Session verification error:", error);
      localStorage.removeItem("user");
      return rejectWithValue("Session verification failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/update`,
        getFetchOptions("POST", userData)
      );

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue("Network error. Please try again.");
    }
  }
);

export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async ({ emailOrPhone, role }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrPhone, role }),
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue("Network error. Please try again.");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ userId, otp, newPassword }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otp, newPassword }),
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue("Network error. Please try again.");
    }
  }
);

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/verify`,
        getFetchOptions("GET")
      );

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return data.user;
    } catch (error) {
      return rejectWithValue("Token verification failed.");
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/all`,
        getFetchOptions("GET")
      );

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return data.users;
    } catch (error) {
      return rejectWithValue("Failed to fetch users.");
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "auth/updateUserStatus",
  async ({ userId, isActive }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${userId}/status`,
        getFetchOptions("PATCH", { isActive })
      );

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return { userId, isActive, user: data.user };
    } catch (error) {
      return rejectWithValue("Failed to update user status.");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${userId}`,
        getFetchOptions("DELETE")
      );

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return userId;
    } catch (error) {
      return rejectWithValue("Failed to delete user.");
    }
  }
);

// Legacy admin login for backward compatibility
export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("Attempting admin login with:", credentials.email);

      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/employeelogin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      console.log("Admin login response:", data);

      if (data.success) {
        // Store user data in localStorage (session handled by cookies)
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error("Admin login error:", error);
      return rejectWithValue("Admin login failed");
    }
  }
);

// Legacy verify admin token for backward compatibility
export const verifyAdminToken = createAsyncThunk(
  "auth/verifyAdminToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/verify`,
        getFetchOptions("GET")
      );

      const data = await response.json();

      console.log("Verify token response:", data);

      // Update user data in localStorage
      if (data.success && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error("Session verification error:", error);
      // Clear localStorage on verification failure
      localStorage.removeItem("user");
      return rejectWithValue("Session verification failed");
    }
  }
);

// Legacy admin logout for backward compatibility
export const adminLogout = createAsyncThunk(
  "auth/adminLogout",
  async (_, { rejectWithValue }) => {
    try {
      // Clear localStorage (session cookie is cleared by server)
      localStorage.removeItem("user");

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      // Clear localStorage even on error
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return rejectWithValue("Logout failed");
    }
  }
);

// Legacy load admin from storage
export const loadAdminFromStorage = createAsyncThunk(
  "auth/loadFromStorage",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token =
        localStorage.getItem("adminToken") || localStorage.getItem("token");
      const userString =
        localStorage.getItem("adminUser") || localStorage.getItem("user");

      if (!token || !userString) {
        return rejectWithValue("No stored credentials found");
      }

      const user = JSON.parse(userString);

      // Verify token is still valid
      await dispatch(verifyAdminToken()).unwrap();

      return { token, user };
    } catch (error) {
      console.error("Load from storage error:", error);
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return rejectWithValue("Failed to load stored credentials");
    }
  }
);

// Trainer Registration Thunks
export const trainerRegistration = createAsyncThunk(
  "auth/trainerRegistration",
  async (
    { fullName, userName, email, phoneNumber, password },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${TRAINER_API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          userName,
          email,
          phoneNumber,
          password,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error || "Registration failed");
      }

      return data;
    } catch (error) {
      return rejectWithValue("Network error. Please try again.");
    }
  }
);

export const verifyTrainerOTP = createAsyncThunk(
  "auth/verifyTrainerOTP",
  async ({ userId, otp }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${TRAINER_API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error || "OTP verification failed");
      }

      return data;
    } catch (error) {
      return rejectWithValue("Network error. Please try again.");
    }
  }
);

export const resendTrainerOTP = createAsyncThunk(
  "auth/resendTrainerOTP",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${TRAINER_API_BASE_URL}/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error || "Failed to resend OTP");
      }

      return data;
    } catch (error) {
      return rejectWithValue("Network error. Please try again.");
    }
  }
);

// Initial state
const getUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log("🔄 Loaded user from localStorage:", {
        id: user._id || user.id,
        role: user.role,
        email: user.email,
      });
      return user;
    }
  } catch (e) {
    console.error("Failed to parse user from localStorage:", e);
    localStorage.removeItem("user");
  }
  return null;
};

const storedUser = getUserFromStorage();

const initialState = {
  user: storedUser,
  users: [],
  isAuthenticated: !!storedUser, // Check if user exists in localStorage
  isLoading: false,
  error: null,
  success: false,
  message: "",
  sessionVerified: null, // null = not checked, true = valid, false = invalid
  trainerRegistrationData: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("user");
      state.user = null;
      state.isAuthenticated = false;
      state.users = [];
      state.error = null;
      state.success = false;
      state.message = "";
      state.sessionVerified = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = "";
    },
    clearMessage: (state) => {
      state.error = null;
      state.success = false;
      state.message = "";
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
    updateUserInList: (state, action) => {
      const { userId, userData } = action.payload;
      const userIndex = state.users.findIndex((user) => user._id === userId);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...userData };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
        state.sessionVerified = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
        if (action.payload.user) {
          state.users.push(action.payload.user);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Forget Password
      .addCase(forgetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Verify Token
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      })

      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update User Status
      .addCase(updateUserStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = `User ${
          action.payload.isActive ? "activated" : "deactivated"
        } successfully`;
        state.error = null;
        const userIndex = state.users.findIndex(
          (user) => user._id === action.payload.userId
        );
        if (userIndex !== -1) {
          state.users[userIndex].isActive = action.payload.isActive;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = "User deleted successfully";
        state.error = null;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Legacy Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })

      // Legacy Verify Admin Token
      .addCase(verifyAdminToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyAdminToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(verifyAdminToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })

      // Legacy Admin Logout
      .addCase(adminLogout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(adminLogout.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      // Legacy Load From Storage
      .addCase(loadAdminFromStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadAdminFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loadAdminFromStorage.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.sessionId = null;
        state.isAuthenticated = false;
        state.success = true;
        state.message = "Logged out successfully";
        state.error = null;
        state.sessionVerified = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        // Even if logout fails on server, clear local state
        state.user = null;
        state.token = null;
        state.sessionId = null;
        state.isAuthenticated = false;
        state.sessionVerified = false;
      })

      // Logout All Devices
      .addCase(logoutAllDevices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutAllDevices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.sessionId = null;
        state.isAuthenticated = false;
        state.success = true;
        state.message = action.payload.message || "Logged out from all devices";
        state.error = null;
        state.sessionVerified = false;
      })
      .addCase(logoutAllDevices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Still clear local state even on failure
        state.user = null;
        state.token = null;
        state.sessionId = null;
        state.isAuthenticated = false;
        state.sessionVerified = false;
      })

      // Verify Session
      .addCase(verifySession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifySession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessionVerified = true;
        state.error = null;
        // Update user data from session verification
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      })
      .addCase(verifySession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.sessionVerified = false;
        // Clear state if session is invalid
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
      })

      // Trainer Registration
      .addCase(trainerRegistration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
        state.message = "";
      })
      .addCase(trainerRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
        state.trainerRegistrationData = {
          userId: action.payload.userId,
          message: action.payload.message,
          otp: action.payload.otp, // Store OTP for display
          adminEmail: action.payload.adminEmail,
        };
      })
      .addCase(trainerRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
        state.message = "";
      })

      // Verify Trainer OTP
      .addCase(verifyTrainerOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verifyTrainerOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
        state.trainerRegistrationData = null; // Clear registration data on success
      })
      .addCase(verifyTrainerOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Resend Trainer OTP
      .addCase(resendTrainerOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendTrainerOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(resendTrainerOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  logout,
  clearError,
  clearSuccess,
  clearMessage,
  setUser,
  setCredentials,
  updateUserInList,
} = authSlice.actions;

export default authSlice.reducer;
