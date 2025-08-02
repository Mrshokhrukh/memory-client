import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import capsuleSlice from './slices/capsuleSlice';
import memorySlice from './slices/memorySlice';
import socketSlice from './slices/socketSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    capsules: capsuleSlice,
    memories: memorySlice,
    socket: socketSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/setSocket'],
        ignoredPaths: ['socket.socket'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
