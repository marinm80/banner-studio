// Paged catalog of backgrounds, loaded through the API-shaped function in
// backgroundsAPI. Holds the current theme, page and results plus a request
// status. Choosing one writes to the editor slice, not to this one.

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchBackgrounds } from './backgroundsAPI';

export const loadBackgrounds = createAsyncThunk(
  'backgrounds/load',
  async ({ theme, page, limit }) => fetchBackgrounds({ theme, page, limit })
);

const initialState = {
  theme: 'all',
  page: 1,
  limit: 12,
  total: 0,
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const backgroundsSlice = createSlice({
  name: 'backgrounds',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBackgrounds.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadBackgrounds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(loadBackgrounds.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setTheme, setPage } = backgroundsSlice.actions;
export default backgroundsSlice.reducer;
