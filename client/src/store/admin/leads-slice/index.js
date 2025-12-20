import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
}/api/leads`;

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

// ============================================
// ASYNC THUNKS - API CALLS
// ============================================

// Create new lead
export const createLead = createAsyncThunk(
  "leads/createLead",
  async (leadData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/create`, leadData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Get all leads with filters
export const fetchAllLeads = createAsyncThunk(
  "leads/fetchAllLeads",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`${API_URL}?${queryParams}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Get lead by ID
export const fetchLeadById = createAsyncThunk(
  "leads/fetchLeadById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Update lead
export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updateData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Delete lead
export const deleteLead = createAsyncThunk(
  "leads/deleteLead",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      return { ...response.data, id };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Update lead status
export const updateLeadStatus = createAsyncThunk(
  "leads/updateLeadStatus",
  async ({ id, status, notes }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${id}/status`,
        { status, notes },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Add follow-up
export const addFollowUp = createAsyncThunk(
  "leads/addFollowUp",
  async ({ id, followUpData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/${id}/follow-up`,
        followUpData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Assign lead to employee
export const assignLead = createAsyncThunk(
  "leads/assignLead",
  async ({ id, employeeId, employeeName }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${id}/assign`,
        { employeeId, employeeName },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Schedule demo
export const scheduleDemo = createAsyncThunk(
  "leads/scheduleDemo",
  async ({ id, demoDate }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/${id}/schedule-demo`,
        { demoDate },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Convert lead to member
export const convertLeadToMember = createAsyncThunk(
  "leads/convertLeadToMember",
  async ({ id, memberId, conversionNotes }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/${id}/convert`,
        { memberId, conversionNotes },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Get lead statistics
export const fetchLeadStatistics = createAsyncThunk(
  "leads/fetchLeadStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/analytics/statistics`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Get hot leads
export const fetchHotLeads = createAsyncThunk(
  "leads/fetchHotLeads",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/filter/hot-leads`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Get today's follow-ups
export const fetchTodaysFollowUps = createAsyncThunk(
  "leads/fetchTodaysFollowUps",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/follow-ups/today`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Get overdue follow-ups
export const fetchOverdueFollowUps = createAsyncThunk(
  "leads/fetchOverdueFollowUps",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/follow-ups/overdue`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Get leads by source
export const fetchLeadsBySource = createAsyncThunk(
  "leads/fetchLeadsBySource",
  async (source, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/filter/source/${source}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Get converted leads
export const fetchConvertedLeads = createAsyncThunk(
  "leads/fetchConvertedLeads",
  async (dateRange = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(dateRange).toString();
      const response = await axios.get(
        `${API_URL}/filter/converted?${queryParams}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Get unassigned leads
export const fetchUnassignedLeads = createAsyncThunk(
  "leads/fetchUnassignedLeads",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/filter/unassigned`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Bulk delete leads
export const bulkDeleteLeads = createAsyncThunk(
  "leads/bulkDeleteLeads",
  async (leadIds, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/bulk/delete`, { leadIds });
      return { ...response.data, leadIds };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Bulk update lead status
export const bulkUpdateLeadStatus = createAsyncThunk(
  "leads/bulkUpdateLeadStatus",
  async ({ leadIds, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/bulk/status`, {
        leadIds,
        status,
      });
      return { ...response.data, leadIds, status };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// ============================================
// INITIAL STATE
// ============================================
const initialState = {
  leads: [],
  currentLead: null,
  hotLeads: [],
  todaysFollowUps: [],
  overdueFollowUps: [],
  convertedLeads: [],
  unassignedLeads: [],
  statistics: {
    totalLeads: 0,
    convertedLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0,
    newLeads: 0,
    conversionRate: 0,
    overdueFollowUps: 0,
    todaysFollowUps: 0,
    unassignedLeads: 0,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalLeads: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isLoading: false,
  error: null,
  success: false,
  message: "",
};

// ============================================
// SLICE
// ============================================
const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = "";
    },
    setCurrentLead: (state, action) => {
      state.currentLead = action.payload;
    },
    clearCurrentLead: (state) => {
      state.currentLead = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============================================
      // CREATE LEAD
      // ============================================
      .addCase(createLead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload.message || "Lead created successfully";
        state.leads.unshift(action.payload.lead);
      })
      .addCase(createLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to create lead";
      })

      // ============================================
      // FETCH ALL LEADS
      // ============================================
      .addCase(fetchAllLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads = action.payload.leads || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchAllLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to fetch leads";
      })

      // ============================================
      // FETCH LEAD BY ID
      // ============================================
      .addCase(fetchLeadById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLead = action.payload.lead;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to fetch lead";
      })

      // ============================================
      // UPDATE LEAD
      // ============================================
      .addCase(updateLead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload.message || "Lead updated successfully";
        const index = state.leads.findIndex(
          (lead) => lead._id === action.payload.lead._id
        );
        if (index !== -1) {
          state.leads[index] = action.payload.lead;
        }
        state.currentLead = action.payload.lead;
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to update lead";
      })

      // ============================================
      // DELETE LEAD
      // ============================================
      .addCase(deleteLead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload.message || "Lead deleted successfully";
        state.leads = state.leads.filter(
          (lead) => lead._id !== action.payload.id
        );
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to delete lead";
      })

      // ============================================
      // UPDATE LEAD STATUS
      // ============================================
      .addCase(updateLeadStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLeadStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message =
          action.payload.message || "Lead status updated successfully";
        const index = state.leads.findIndex(
          (lead) => lead._id === action.payload.lead._id
        );
        if (index !== -1) {
          state.leads[index] = action.payload.lead;
        }
        state.currentLead = action.payload.lead;
      })
      .addCase(updateLeadStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to update status";
      })

      // ============================================
      // ADD FOLLOW-UP
      // ============================================
      .addCase(addFollowUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addFollowUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message =
          action.payload.message || "Follow-up added successfully";
        const index = state.leads.findIndex(
          (lead) => lead._id === action.payload.lead._id
        );
        if (index !== -1) {
          state.leads[index] = action.payload.lead;
        }
        state.currentLead = action.payload.lead;
      })
      .addCase(addFollowUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to add follow-up";
      })

      // ============================================
      // ASSIGN LEAD
      // ============================================
      .addCase(assignLead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload.message || "Lead assigned successfully";
        const index = state.leads.findIndex(
          (lead) => lead._id === action.payload.lead._id
        );
        if (index !== -1) {
          state.leads[index] = action.payload.lead;
        }
        state.currentLead = action.payload.lead;
      })
      .addCase(assignLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to assign lead";
      })

      // ============================================
      // SCHEDULE DEMO
      // ============================================
      .addCase(scheduleDemo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(scheduleDemo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload.message || "Demo scheduled successfully";
        const index = state.leads.findIndex(
          (lead) => lead._id === action.payload.lead._id
        );
        if (index !== -1) {
          state.leads[index] = action.payload.lead;
        }
        state.currentLead = action.payload.lead;
      })
      .addCase(scheduleDemo.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to schedule demo";
      })

      // ============================================
      // CONVERT LEAD TO MEMBER
      // ============================================
      .addCase(convertLeadToMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(convertLeadToMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload.message || "Lead converted successfully";
        const index = state.leads.findIndex(
          (lead) => lead._id === action.payload.lead._id
        );
        if (index !== -1) {
          state.leads[index] = action.payload.lead;
        }
        state.currentLead = action.payload.lead;
      })
      .addCase(convertLeadToMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to convert lead";
      })

      // ============================================
      // FETCH LEAD STATISTICS
      // ============================================
      .addCase(fetchLeadStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeadStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statistics = action.payload.statistics || initialState.statistics;
      })
      .addCase(fetchLeadStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to fetch statistics";
      })

      // ============================================
      // FETCH HOT LEADS
      // ============================================
      .addCase(fetchHotLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHotLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hotLeads = action.payload.leads || [];
      })
      .addCase(fetchHotLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to fetch hot leads";
      })

      // ============================================
      // FETCH TODAY'S FOLLOW-UPS
      // ============================================
      .addCase(fetchTodaysFollowUps.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodaysFollowUps.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todaysFollowUps = action.payload.leads || [];
      })
      .addCase(fetchTodaysFollowUps.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to fetch today's follow-ups";
      })

      // ============================================
      // FETCH OVERDUE FOLLOW-UPS
      // ============================================
      .addCase(fetchOverdueFollowUps.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOverdueFollowUps.fulfilled, (state, action) => {
        state.isLoading = false;
        state.overdueFollowUps = action.payload.leads || [];
      })
      .addCase(fetchOverdueFollowUps.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to fetch overdue follow-ups";
      })

      // ============================================
      // FETCH LEADS BY SOURCE
      // ============================================
      .addCase(fetchLeadsBySource.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeadsBySource.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads = action.payload.leads || [];
      })
      .addCase(fetchLeadsBySource.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to fetch leads by source";
      })

      // ============================================
      // FETCH CONVERTED LEADS
      // ============================================
      .addCase(fetchConvertedLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConvertedLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.convertedLeads = action.payload.leads || [];
      })
      .addCase(fetchConvertedLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to fetch converted leads";
      })

      // ============================================
      // FETCH UNASSIGNED LEADS
      // ============================================
      .addCase(fetchUnassignedLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnassignedLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unassignedLeads = action.payload.leads || [];
      })
      .addCase(fetchUnassignedLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to fetch unassigned leads";
      })

      // ============================================
      // BULK DELETE LEADS
      // ============================================
      .addCase(bulkDeleteLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bulkDeleteLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload.message || "Leads deleted successfully";
        state.leads = state.leads.filter(
          (lead) => !action.payload.leadIds.includes(lead._id)
        );
      })
      .addCase(bulkDeleteLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to delete leads";
      })

      // ============================================
      // BULK UPDATE LEAD STATUS
      // ============================================
      .addCase(bulkUpdateLeadStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bulkUpdateLeadStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload.message || "Leads updated successfully";
        // Update status for all affected leads
        state.leads = state.leads.map((lead) =>
          action.payload.leadIds.includes(lead._id)
            ? { ...lead, leadStatus: action.payload.status }
            : lead
        );
      })
      .addCase(bulkUpdateLeadStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to update leads";
      });
  },
});

// ============================================
// EXPORTS
// ============================================
export const { clearError, clearSuccess, setCurrentLead, clearCurrentLead } =
  leadsSlice.actions;

export default leadsSlice.reducer;
