import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ArchiveState } from './archive.util';
import { Archive } from '@util/types/archive.type';

const initialState: ArchiveState = {
  count: 0,
  data: [],
};

const archiveSlice = createSlice({
  name: 'archive',
  initialState,
  reducers: {
    loadArchives: (state, action: PayloadAction<ArchiveState>) => {
      state.count = action.payload.count;
      state.data = action.payload.data;
    },
    addArchive: (state, action: PayloadAction<Archive>) => {
      state.count = state.count + 1;
      state.data = [action.payload, ...state.data];
    },
    removeArchive: (state, action: PayloadAction<number>) => {
      const existingIndex = state.data.findIndex(
        (item) => item.id === action.payload,
      );

      if (existingIndex === -1) {
        return;
      }

      const deleteCount = 1;
      state.data.splice(existingIndex, deleteCount);
      state.count--;
    },
  },
});

export default archiveSlice.reducer;
export const { loadArchives, addArchive, removeArchive } = archiveSlice.actions;
