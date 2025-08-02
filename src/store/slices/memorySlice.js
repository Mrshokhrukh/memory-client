import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../services/api"

// Async thunks
export const fetchMemories = createAsyncThunk(
  "memories/fetchMemories",
  async ({ capsuleId, page = 1, limit = 20, type } = {}, { rejectWithValue }) => {
    try {
      let url = `/memories/capsule/${capsuleId}?page=${page}&limit=${limit}`
      if (type) url += `&type=${type}`

      const response = await api.get(url)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch memories")
    }
  },
)

export const createMemory = createAsyncThunk("memories/createMemory", async (memoryData, { rejectWithValue }) => {
  try {
    const response = await api.post("/memories", memoryData)
    return response.data.data.memory
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create memory")
  }
})

export const updateMemory = createAsyncThunk(
  "memories/updateMemory",
  async ({ memoryId, updateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/memories/${memoryId}`, updateData)
      return response.data.data.memory
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update memory")
    }
  },
)

export const deleteMemory = createAsyncThunk("memories/deleteMemory", async (memoryId, { rejectWithValue }) => {
  try {
    await api.delete(`/memories/${memoryId}`)
    return memoryId
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete memory")
  }
})

export const reactToMemory = createAsyncThunk(
  "memories/reactToMemory",
  async ({ memoryId, emoji }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/memories/${memoryId}/react`, { emoji })
      return { memoryId, reactions: response.data.data.reactions }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to react to memory")
    }
  },
)

export const addComment = createAsyncThunk("memories/addComment", async ({ memoryId, text }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/memories/${memoryId}/comment`, { text })
    return { memoryId, comment: response.data.data.comment }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to add comment")
  }
})

export const pinMemory = createAsyncThunk("memories/pinMemory", async (memoryId, { rejectWithValue }) => {
  try {
    const response = await api.post(`/memories/${memoryId}/pin`)
    return { memoryId, isPinned: response.data.data.isPinned }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to pin memory")
  }
})

const initialState = {
  memories: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
  filters: {
    type: null,
    search: "",
  },
}

const memorySlice = createSlice({
  name: "memories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearMemories: (state) => {
      state.memories = []
      state.pagination = {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      }
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    addMemoryToList: (state, action) => {
      state.memories.unshift(action.payload)
      state.pagination.total += 1
    },
    updateMemoryInList: (state, action) => {
      const updatedMemory = action.payload
      const index = state.memories.findIndex((m) => m._id === updatedMemory._id)
      if (index !== -1) {
        state.memories[index] = updatedMemory
      }
    },
    removeMemoryFromList: (state, action) => {
      const memoryId = action.payload
      state.memories = state.memories.filter((m) => m._id !== memoryId)
      state.pagination.total -= 1
    },
    updateMemoryReactions: (state, action) => {
      const { memoryId, reactions } = action.payload
      const memory = state.memories.find((m) => m._id === memoryId)
      if (memory) {
        memory.reactions = reactions
      }
    },
    addCommentToMemory: (state, action) => {
      const { memoryId, comment } = action.payload
      const memory = state.memories.find((m) => m._id === memoryId)
      if (memory) {
        memory.comments.push(comment)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Memories
      .addCase(fetchMemories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMemories.fulfilled, (state, action) => {
        state.loading = false
        const { memories, pagination } = action.payload

        if (pagination.page === 1) {
          state.memories = memories
        } else {
          state.memories = [...state.memories, ...memories]
        }

        state.pagination = pagination
      })
      .addCase(fetchMemories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create Memory
      .addCase(createMemory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createMemory.fulfilled, (state, action) => {
        state.loading = false
        state.memories.unshift(action.payload)
        state.pagination.total += 1
      })
      .addCase(createMemory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update Memory
      .addCase(updateMemory.fulfilled, (state, action) => {
        const updatedMemory = action.payload
        const index = state.memories.findIndex((m) => m._id === updatedMemory._id)
        if (index !== -1) {
          state.memories[index] = updatedMemory
        }
      })
      .addCase(updateMemory.rejected, (state, action) => {
        state.error = action.payload
      })

      // Delete Memory
      .addCase(deleteMemory.fulfilled, (state, action) => {
        const memoryId = action.payload
        state.memories = state.memories.filter((m) => m._id !== memoryId)
        state.pagination.total -= 1
      })
      .addCase(deleteMemory.rejected, (state, action) => {
        state.error = action.payload
      })

      // React to Memory
      .addCase(reactToMemory.fulfilled, (state, action) => {
        const { memoryId, reactions } = action.payload
        const memory = state.memories.find((m) => m._id === memoryId)
        if (memory) {
          memory.reactions = reactions
        }
      })
      .addCase(reactToMemory.rejected, (state, action) => {
        state.error = action.payload
      })

      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { memoryId, comment } = action.payload
        const memory = state.memories.find((m) => m._id === memoryId)
        if (memory) {
          memory.comments.push(comment)
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload
      })

      // Pin Memory
      .addCase(pinMemory.fulfilled, (state, action) => {
        const { memoryId, isPinned } = action.payload
        const memory = state.memories.find((m) => m._id === memoryId)
        if (memory) {
          memory.isPinned = isPinned
        }

        // Re-sort memories to put pinned ones first
        state.memories.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1
          return new Date(b.createdAt) - new Date(a.createdAt)
        })
      })
      .addCase(pinMemory.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const {
  clearError,
  clearMemories,
  setFilter,
  addMemoryToList,
  updateMemoryInList,
  removeMemoryFromList,
  updateMemoryReactions,
  addCommentToMemory,
} = memorySlice.actions

export default memorySlice.reducer
