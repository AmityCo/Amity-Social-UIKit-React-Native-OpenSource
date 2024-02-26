import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IPost } from '../../components/Social/PostList';

interface FeedState {
  postList: IPost[];
}
const initialState: FeedState = {
  postList: [],
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    updateFeed: (state, action: PayloadAction<IPost[]>) => {
      const getUniqueArrayById = (arr: IPost[]) => {
        const uniqueIds = new Set(state.postList.map((post) => post.postId));
        return arr.filter((post) => !uniqueIds.has(post.postId));
      };
      state.postList = [
        ...state.postList,
        ...getUniqueArrayById(action.payload),
      ];
    },

    updateByPostId: (
      state,
      action: PayloadAction<{ postId: string; postDetail: IPost }>
    ) => {
      const { postId, postDetail } = action.payload;

      const index = state.postList.findIndex((item) => item.postId === postId);
      state.postList[index] = postDetail;
    },
    deleteByPostId: (state, action: PayloadAction<{ postId: string }>) => {
      const { postId } = action.payload;
      const prevPostList: IPost[] = [...state.postList];
      const updatedPostList: IPost[] = prevPostList.filter(
        (item) => item.postId !== postId
      );

      state.postList = updatedPostList;
    },
    clearFeed: (state) => {
      state.postList = [];
    },
  },
});

// const {actions: globalFeedActions, reducer: globalFeedReducer } = globalFeedSlice
export default feedSlice;
