import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchDashboardStatsRequest } from "../../api/dashboard.api";
import { DashboardStats } from "../../types/dashboard.types";
import { logout } from "../auth/authSlice";

interface DashboardState {
  stats: DashboardStats | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  status: "idle",
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchDashboardStats",
  async (_: void, { rejectWithValue }) => {
    try {
      return await fetchDashboardStatsRequest();
    } catch (err) {
      const anyErr = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(anyErr.response?.data?.message || "Could not load dashboard stats.");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action: PayloadAction<unknown>) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(logout, () => initialState);
  },
});

export default dashboardSlice.reducer;