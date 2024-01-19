import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IPost } from '../../components/Social/PostList';

interface PostDetailState {
  currentIndex: number;
  currentPostdetail: IPost | {};
}
const initialState: PostDetailState = {
  currentIndex: 0,
  currentPostdetail: {},
};

const postDetailSlice = createSlice({
  name: 'postDetail',
  initialState,
  reducers: {
    updateCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    updatePostDetail: (state, action: PayloadAction<IPost>) => {
      state.currentPostdetail = action.payload;
    },
  },
});

export default postDetailSlice;
