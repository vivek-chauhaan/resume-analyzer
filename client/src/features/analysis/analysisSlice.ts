import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  runAnalysisRequest,
  fetchAnalysisRequest,
  runJobMatchRequest,
} from "../../api/analysis.api";
import { Analysis } from "../../types/analysis.types";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface AnalysisState {
  current: Analysis | null;
  status: Status;          // loading/running the full analysis
  jobMatchStatus: Status;  // loading the job-description match only
  error: string | null;
  jobMatchError: string | null;
}

const initialState: AnalysisState = {
  current: null,
  status: "idle",
  jobMatchStatus: "idle",
  error: null,
  jobMatchError: null,
};

function extractErrorMessage(err: unknown): string {
  const anyErr = err as { response?: { data?: { message?: string } } };
  return anyErr.response?.data?.message || "Something went wrong. Please try again.";
}

export const runAnalysis = createAsyncThunk(
  "analysis/runAnalysis",
  async (resumeId: string, { rejectWithValue }) => {
    try {
      return await runAnalysisRequest(resumeId);
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchAnalysis = createAsyncThunk(
  "analysis/fetchAnalysis",
  async (resumeId: string, { rejectWithValue }) => {
    try {
      return await fetchAnalysisRequest(resumeId);
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const runJobMatch = createAsyncThunk(
  "analysis/runJobMatch",
  async (
    { resumeId, jobDescription }: { resumeId: string; jobDescription: string },
    { rejectWithValue }
  ) => {
    try {
      return await runJobMatchRequest(resumeId, jobDescription);
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    // Called when the report page mounts, so a previous resume's report
    // never flashes on screen while the new one loads.
    clearAnalysis(state) {
      state.current = null;
      state.status = "idle";
      state.jobMatchStatus = "idle";
      state.error = null;
      state.jobMatchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // runAnalysis
      .addCase(runAnalysis.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(runAnalysis.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
      })
      .addCase(runAnalysis.rejected, (state, action: PayloadAction<unknown>) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // fetchAnalysis
      .addCase(fetchAnalysis.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAnalysis.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchAnalysis.rejected, (state, action: PayloadAction<unknown>) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // runJobMatch
      .addCase(runJobMatch.pending, (state) => {
        state.jobMatchStatus = "loading";
        state.jobMatchError = null;
      })
      .addCase(runJobMatch.fulfilled, (state, action) => {
        state.jobMatchStatus = "succeeded";
        state.current = action.payload; // server returns the updated Analysis
      })
      .addCase(runJobMatch.rejected, (state, action: PayloadAction<unknown>) => {
        state.jobMatchStatus = "failed";
        state.jobMatchError = action.payload as string;
      });
  },
});

export const { clearAnalysis } = analysisSlice.actions;
export default analysisSlice.reducer;