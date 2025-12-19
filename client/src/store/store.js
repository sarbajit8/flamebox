import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/auth-slice";
import employeeReducer from "./admin/employee-slice";
import employeeAuthReducer from "./admin/employeelogin-slice";
import packagesReducer from "./admin/packages-slice";
import membersReducer from "./admin/members-slice";
import leadsReducer from "./admin/leads-slice"; // Add this import

const store = configureStore({
  reducer: {
    auth: authReducer,                 // Admin authentication
    employee: employeeReducer,         // Employee CRUD operations
    employeeAuth: employeeAuthReducer, // Employee authentication
    packages: packagesReducer,         // Packages CRUD operations
    members: membersReducer,           // Members CRUD operations
    leads: leadsReducer,               // Leads CRUD operations - ADD THIS LINE
  },
});

export default store;