import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchSampleDeadlines, sampleSubjects } from './deadlinesApi';
import type { Deadline, NewDeadline } from './deadlinesTypes';

interface DeadlinesState {
  items: Deadline[];
  subjects: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DeadlinesState = { items: [], subjects: sampleSubjects, status: 'idle', error: null };

export const loadDeadlines = createAsyncThunk('deadlines/load', fetchSampleDeadlines);

const deadlinesSlice = createSlice({
  name: 'deadlines',
  initialState,
  reducers: {
    addDeadline: (state, action: PayloadAction<NewDeadline>) => {
      state.items.unshift({ ...action.payload, id: crypto.randomUUID(), completed: false });
    },
    toggleDeadline: (state, action: PayloadAction<string>) => {
      const deadline = state.items.find((item) => item.id === action.payload);
      if (deadline) deadline.completed = !deadline.completed;
    },
    deleteDeadline: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    addSubject: (state, action: PayloadAction<string>) => {
      if (!state.subjects.includes(action.payload)) state.subjects.push(action.payload);
    },
    deleteSubject: (state, action: PayloadAction<string>) => {
      state.subjects = state.subjects.filter((subject) => subject !== action.payload);
      state.items = state.items.filter((item) => item.subject !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDeadlines.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadDeadlines.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.subjects = Array.from(new Set([...state.subjects, ...action.payload.map((item) => item.subject)]));
      })
      .addCase(loadDeadlines.rejected, (state) => {
        state.status = 'failed';
        state.error = 'Không thể tải danh sách bài tập mẫu.';
      });
  },
});

export const { addDeadline, toggleDeadline, deleteDeadline, addSubject, deleteSubject } = deadlinesSlice.actions;
export default deadlinesSlice.reducer;
