import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ComponentID, PageID } from '../../v4/enum';

export interface BottomSheetState {
  isBottomSheetOpen: boolean;
  content: JSX.Element | null;
  height?: number;
  pageId?: PageID;
  componentId?: ComponentID;
}

const initialState: BottomSheetState = {
  isBottomSheetOpen: false,
  content: null,
  height: 200,
  pageId: PageID.WildCardPage,
  componentId: ComponentID.WildCardComponent,
};

const bottomSheetSlice = createSlice({
  name: 'bottomSheet',
  initialState,
  reducers: {
    openBottomSheet: (
      state,
      action: PayloadAction<{ content: JSX.Element; height?: number }>
    ) => {
      state.isBottomSheetOpen = true;
      state.content = action.payload.content;
      state.height = action.payload.height || 200;
    },
    closeBottomSheet: (state) => {
      state.isBottomSheetOpen = false;
      state.content = null;
    },
  },
});

export default bottomSheetSlice;
