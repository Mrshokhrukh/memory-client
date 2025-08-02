import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../services/api"

// Async thunks
export const fetchCapsules = createAsyncThunk(
  "capsules/fetchCapsules",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/capsules?page=${page}&limit=${limit}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch capsules")
    }
  },
)

export const fetchCapsuleById = createAsyncThunk(
  "capsules/fetchCapsuleById",
  async (capsuleId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/capsules/${capsuleId}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch capsule")
    }
  },
)

export const createCapsule = createAsyncThunk("capsules/createCapsule", async (capsuleData, { rejectWithValue }) => {
  try {
    const response = await api.post("/capsules", capsuleData)
    return response.data.data.capsule
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create capsule")
  }
})

export const updateCapsule = createAsyncThunk(
  "capsules/updateCapsule",
  async ({ capsuleId, updateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/capsules/${capsuleId}`, updateData)
      return response.data.data.capsule
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update capsule")
    }
  },
)

export const joinCapsule = createAsyncThunk(
  "capsules/joinCapsule",
  async ({ capsuleId, inviteCode }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/capsules/${capsuleId}/join`, { inviteCode })
      return response.data.data.capsule
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to join capsule")
    }
  },
)

export const leaveCapsule = createAsyncThunk("capsules/leaveCapsule", async (capsuleId, { rejectWithValue }) => {
  try {
    await api.delete(`/capsules/${capsuleId}/leave`)
    return capsuleId
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to leave capsule")
  }
})

export const fetchPublicCapsules = createAsyncThunk(
  "capsules/fetchPublicCapsules",
  async ({ page = 1, limit = 12, search = "" } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/capsules/explore/public?page=${page}&limit=${limit}&search=${search}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch public capsules")
    }
  },
)

const initialState = {
  capsules: [],
  currentCapsule: null,
  publicCapsules: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  publicPagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
}

const capsuleSlice = createSlice({
  name: "capsules",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentCapsule: (state) => {
      state.currentCapsule = null
    },
    updateCapsuleInList: (state, action) => {
      const updatedCapsule = action.payload
      const index = state.capsules.findIndex((c) => c._id === updatedCapsule._id)
      if (index !== -1) {
        state.capsules[index] = updatedCapsule
      }
    },
    addUserToCapsule: (state, action) => {
      const { capsuleId, user } = action.payload
      if (state.currentCapsule && state.currentCapsule._id === capsuleId) {
        state.currentCapsule.contributors.push({
          user,
          joinedAt: new Date().toISOString(),
          role: "contributor",
        })
        state.currentCapsule.stats.totalContributors += 1
      }
    },
    removeUserFromCapsule: (state, action) => {
      const { capsuleId, userId } = action.payload
      if (state.currentCapsule && state.currentCapsule._id === capsuleId) {
        state.currentCapsule.contributors = state.currentCapsule.contributors.filter((c) => c.user._id !== userId)
        state.currentCapsule.stats.totalContributors -= 1
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Capsules
      .addCase(fetchCapsules.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCapsules.fulfilled, (state, action) => {
        state.loading = false
        state.capsules = action.payload.capsules
        state.pagination = action.payload.pagination
      })
      .addCase(fetchCapsules.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch Capsule by ID
      .addCase(fetchCapsuleById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCapsuleById.fulfilled, (state, action) => {
        state.loading = false
        state.currentCapsule = action.payload.capsule
      })
      .addCase(fetchCapsuleById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create Capsule
      .addCase(createCapsule.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCapsule.fulfilled, (state, action) => {
        state.loading = false
        state.capsules.unshift(action.payload)
      })
      .addCase(createCapsule.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update Capsule
      .addCase(updateCapsule.fulfilled, (state, action) => {
        const updatedCapsule = action.payload
        const index = state.capsules.findIndex((c) => c._id === updatedCapsule._id)
        if (index !== -1) {
          state.capsules[index] = updatedCapsule
        }
        if (state.currentCapsule && state.currentCapsule._id === updatedCapsule._id) {
          state.currentCapsule = updatedCapsule
        }
      })
      .addCase(updateCapsule.rejected, (state, action) => {
        state.error = action.payload
      })

      // Join Capsule
      .addCase(joinCapsule.fulfilled, (state, action) => {
        const joinedCapsule = action.payload
        const existingIndex = state.capsules.findIndex((c) => c._id === joinedCapsule._id)
        if (existingIndex === -1) {
          state.capsules.unshift(joinedCapsule)
        }
      })
      .addCase(joinCapsule.rejected, (state, action) => {
        state.error = action.payload
      })

      // Leave Capsule
      .addCase(leaveCapsule.fulfilled, (state, action) => {
        const capsuleId = action.payload
        state.capsules = state.capsules.filter((c) => c._id !== capsuleId)
        if (state.currentCapsule && state.currentCapsule._id === capsuleId) {
          state.currentCapsule = null
        }
      })
      .addCase(leaveCapsule.rejected, (state, action) => {
        state.error = action.payload
      })

      // Fetch Public Capsules
      .addCase(fetchPublicCapsules.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPublicCapsules.fulfilled, (state, action) => {
        state.loading = false
        state.publicCapsules = action.payload.capsules
        state.publicPagination = action.payload.pagination
      })
      .addCase(fetchPublicCapsules.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentCapsule, updateCapsuleInList, addUserToCapsule, removeUserFromCapsule } =
  capsuleSlice.actions

export default capsuleSlice.reducer
