import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  employeeList: [],
  employeeDetails: null,
  error: null,
};

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

// ✅ Add a new Employee
export const addEmployee = createAsyncThunk(
  "employee/addEmployee",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/postemployees`,
        getFetchOptions("POST", formData)
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Add employee error:", data);
        return rejectWithValue(
          data.error || data.message || "Failed to add employee"
        );
      }

      console.log("Add employee response:", data);
      return data;
    } catch (error) {
      console.error("Add employee error:", error.message);
      return rejectWithValue("Failed to add employee");
    }
  }
);

// ✅ Fetch all Employees
export const getAllEmployees = createAsyncThunk(
  "employee/getAllEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/getemployees`,
        getFetchOptions("GET")
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Get employees error:", data);
        return rejectWithValue(
          data.error || data.message || "Failed to fetch employees"
        );
      }

      console.log("Get all employees response:", data);
      return data;
    } catch (error) {
      console.error("Get employees error:", error.message);
      return rejectWithValue("Failed to fetch employees");
    }
  }
);

// ✅ Fetch Employee by ID
export const getEmployeeById = createAsyncThunk(
  "employee/getEmployeeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/getemployee/${id}`,
        getFetchOptions("GET")
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Get employee by ID error:", data);
        return rejectWithValue(
          data.error || data.message || "Employee not found"
        );
      }

      console.log("Get employee by ID response:", data);
      return data;
    } catch (error) {
      console.error("Get employee by ID error:", error.message);
      return rejectWithValue("Employee not found");
    }
  }
);

// ✅ Edit Employee by ID
export const editEmployee = createAsyncThunk(
  "employee/editEmployee",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/editemployees/${id}`,
        getFetchOptions("PUT", formData)
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Edit employee error:", data);
        return rejectWithValue(
          data.error || data.message || "Failed to update employee"
        );
      }

      console.log("Edit employee response:", data);
      return data;
    } catch (error) {
      console.error("Edit employee error:", error.message);
      return rejectWithValue("Failed to update employee");
    }
  }
);

// ✅ Delete Employee by ID
export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/deleteemployees/${id}`,
        getFetchOptions("DELETE")
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Delete employee error:", data);
        return rejectWithValue(
          data.error || data.message || "Failed to delete employee"
        );
      }

      console.log("Delete employee success, ID:", id);
      return id;
    } catch (error) {
      console.error("Delete employee error:", error.message);
      return rejectWithValue("Failed to delete employee");
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    clearEmployeeDetails: (state) => {
      state.employeeDetails = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Employee
      .addCase(addEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("Add fulfilled payload:", action.payload);
        if (action.payload?.employee) {
          state.employeeList.push(action.payload.employee);
        }
        state.error = null;
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error("Add rejected:", action.payload);
      })

      // Get All Employees
      .addCase(getAllEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("GetAll fulfilled payload:", action.payload);
        state.employeeList =
          action.payload?.employees || action.payload?.data || [];
        state.error = null;
      })
      .addCase(getAllEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.employeeList = [];
        state.error = action.payload;
        console.error("GetAll rejected:", action.payload);
      })

      // Get Employee by ID
      .addCase(getEmployeeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("GetByID fulfilled payload:", action.payload);
        state.employeeDetails =
          action.payload?.employee || action.payload?.data || null;
        state.error = null;
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.isLoading = false;
        state.employeeDetails = null;
        state.error = action.payload;
        console.error("GetByID rejected:", action.payload);
      })

      // Edit Employee
      .addCase(editEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("Edit fulfilled payload:", action.payload);
        if (action.payload?.employee) {
          state.employeeList = state.employeeList.map((employee) =>
            employee._id === action.payload.employee._id
              ? action.payload.employee
              : employee
          );
          if (state.employeeDetails?._id === action.payload.employee._id) {
            state.employeeDetails = action.payload.employee;
          }
        }
        state.error = null;
      })
      .addCase(editEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error("Edit rejected:", action.payload);
      })

      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("Delete fulfilled, removed ID:", action.payload);
        state.employeeList = state.employeeList.filter(
          (employee) => employee._id !== action.payload
        );
        if (state.employeeDetails?._id === action.payload) {
          state.employeeDetails = null;
        }
        state.error = null;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error("Delete rejected:", action.payload);
      });
  },
});

export const { clearEmployeeDetails, clearError } = employeeSlice.actions;
export default employeeSlice.reducer;
