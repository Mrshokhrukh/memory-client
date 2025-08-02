import { createSlice } from "@reduxjs/toolkit"
import { io } from "socket.io-client"

const initialState = {
  socket: null,
  isConnected: false,
  activeUsers: [],
  onlineUsers: [],
  typingUsers: [],
  liveReactions: [],
  error: null,
}

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload
    },
    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload
    },
    addOnlineUser: (state, action) => {
      const user = action.payload
      if (!state.onlineUsers.find((u) => u.userId === user.userId)) {
        state.onlineUsers.push(user)
      }
    },
    removeOnlineUser: (state, action) => {
      const userId = action.payload
      state.onlineUsers = state.onlineUsers.filter((u) => u.userId !== userId)
    },
    setTypingUser: (state, action) => {
      const { userId, user, capsuleId, memoryId, isTyping } = action.payload
      if (isTyping) {
        const existingIndex = state.typingUsers.findIndex((t) => t.userId === userId && t.memoryId === memoryId)
        if (existingIndex === -1) {
          state.typingUsers.push({ userId, user, capsuleId, memoryId })
        }
      } else {
        state.typingUsers = state.typingUsers.filter((t) => !(t.userId === userId && t.memoryId === memoryId))
      }
    },
    addLiveReaction: (state, action) => {
      const reaction = { ...action.payload, id: Date.now() }
      state.liveReactions.push(reaction)
      // Remove after 3 seconds
      setTimeout(() => {
        state.liveReactions = state.liveReactions.filter((r) => r.id !== reaction.id)
      }, 3000)
    },
    setSocketError: (state, action) => {
      state.error = action.payload
    },
    clearSocketError: (state) => {
      state.error = null
    },
  },
})

export const {
  setSocket,
  setConnected,
  setActiveUsers,
  addOnlineUser,
  removeOnlineUser,
  setTypingUser,
  addLiveReaction,
  setSocketError,
  clearSocketError,
} = socketSlice.actions

// Thunk for initializing socket connection
export const initializeSocket = () => (dispatch, getState) => {
  const { auth } = getState()

  if (!auth.token || !auth.isAuthenticated) {
    return
  }

  const socket = io(process.env.REACT_APP_SERVER_URL || "http://localhost:5000", {
    auth: {
      token: auth.token,
    },
  })

  dispatch(setSocket(socket))

  socket.on("connect", () => {
    console.log("✅ Socket connected")
    dispatch(setConnected(true))
    socket.emit("join_capsules")
  })

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected")
    dispatch(setConnected(false))
  })

  socket.on("user_online", (data) => {
    dispatch(addOnlineUser(data))
  })

  socket.on("user_offline", (data) => {
    dispatch(removeOnlineUser(data.userId))
  })

  socket.on("user_typing", (data) => {
    dispatch(setTypingUser(data))
  })

  socket.on("live_reaction", (data) => {
    dispatch(addLiveReaction(data))
  })

  socket.on("error", (error) => {
    dispatch(setSocketError(error.message))
  })

  return socket
}

export const disconnectSocket = () => (dispatch, getState) => {
  const { socket } = getState().socket
  if (socket) {
    socket.disconnect()
    dispatch(setSocket(null))
    dispatch(setConnected(false))
  }
}

export default socketSlice.reducer
