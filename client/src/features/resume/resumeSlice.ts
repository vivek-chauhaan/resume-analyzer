import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  uploadResumeRequest,
  fetchResumesRequest,
  deleteResumeRequest,
} from "../../api/resume.api";
import { Resume, ResumeListParams } from "../../types/resume.types";

interface ResumeState {
  items: Resume[];
  current: Resume | null;
  pagination: { page: number; totalPages: number; total: number };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ResumeState = {
  items: [],
  current: null,
  pagination: { page: 1, totalPages: 1, total: 0 },
  status: "idle",
  error: null,
};

function extractErrorMessage(err: unknown): string {
  const anyErr = err as { response?: { data?: { message?: string } } };
  return anyErr.response?.data?.message || "Something went wrong. Please try again.";
}

export const uploadResume = createAsyncThunk(
  "resume/uploadResume",
  async (file: File, { rejectWithValue }) => {
    try {
      return await uploadResumeRequest(file);
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchResumes = createAsyncThunk(
  "resume/fetchResumes",
  async (params: ResumeListParams = {}, { rejectWithValue }) => {
    try {
      return await fetchResumesRequest(params);
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const deleteResume = createAsyncThunk(
  "resume/deleteResume",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteResumeRequest(id);
      return id;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    clearResumeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResume.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.status = "succeeded";
        // New upload goes to the top of the list without a full refetch
        state.items.unshift(action.payload);
      })
      .addCase(uploadResume.rejected, (state, action: PayloadAction<unknown>) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchResumes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchResumes.rejected, (state, action: PayloadAction<unknown>) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r._id !== action.payload);
      });
  },
});

export const { clearResumeError } = resumeSlice.actions;
export default resumeSlice.reducer;
