import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  sidebarOpen: false,
  modals: {
    createMemory: false,
    editProfile: false,
    inviteUsers: false,
    capsuleSettings: false,
  },
  notifications: [],
  loading: {
    upload: false,
    page: false,
  },
  toast: {
    show: false,
    message: '',
    type: 'info', // info, success, error, warning
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key] = false;
      });
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.unshift(notification);
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
    showToast: (state, action) => {
      state.toast = {
        show: true,
        ...action.payload,
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  markNotificationRead,
  clearNotifications,
  setLoading,
  showToast,
  hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;
