import { Store, configureStore } from '@reduxjs/toolkit';

import globalFeedSlice from '../slices/globalfeedSlice';
import feedSlice from '../slices/feedSlice';
import postDetailSlice from '../slices/postDetailSlice';
import uiSlice from '../slices/uiSlice';

export const store: Store = configureStore({
  reducer: {
    globalFeed: globalFeedSlice.reducer,
    postDetail: postDetailSlice.reducer,
    feed: feedSlice.reducer,
    ui: uiSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
