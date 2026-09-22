import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import resumeReducer from "../features/resume/resumeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    // Day 4+: analysis: analysisReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
