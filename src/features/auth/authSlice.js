import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import api from '../../api'

// Define the async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(`auth/signup`, userData)
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      toast.success('Registration successful!', {
        duration: 3000,
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Define the async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/login', credentials) // ✅ Ensure cookies are sent

      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }

      toast.success(response?.data?.message, { duration: 3000 })

      return response.data // ✅ No need to store token manually, cookies will handle authentication
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Define the async thunk for user login
export const viewProfile = createAsyncThunk(
  'auth/viewProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/profile-view')
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      return response.data
    } catch (error) {
      console.log(error?.response?.status)
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/profile-update', profileData) // ✅ Ensure cookies are sent
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (inputData, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/change-password', inputData) // ✅ Ensure cookies are sent
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      toast.success(response?.data?.message, {
        duration: 3000,
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await api.post('auth/logout') // ✅ Ensure cookies are sent
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      return response.data
    } catch (error) {
      console.log(error?.response?.status)
      if (error?.response?.status === 403) {
        //request for new access token
      }
      return rejectWithValue(error.response.data)
    } finally {
      localStorage.removeItem('authToken')
    }
  }
)

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (inputData, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/forgot-password', inputData) // ✅ Ensure cookies are sent
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      toast.success(response?.data?.message, {
        duration: 3000,
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (inputData, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/reset-password', inputData) // ✅ Ensure cookies are sent
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoggedIn: false,
    authToken: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isLoggedIn = false
        state.loading = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.data.userDetails
        state.authToken = action.payload.data.token
        state.isLoggedIn = true
        state.loading = false
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload?.data?.userDetails
        state.loading = false
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(viewProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(viewProfile.fulfilled, (state, action) => {
        state.user = action.payload?.data?.userDetails
        state.loading = false
      })
      .addCase(viewProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.user = action.payload?.data?.userDetails
        state.loading = false
        state.authToken = undefined
        state.isLoggedIn = false
        localStorage.removeItem('authToken')
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })
      .addCase(logout.pending, (state, action) => {
        state.loading = true
        // localStorage.removeItem('authToken')
      })
      .addCase(logout.fulfilled, (state, action) => {
        // console.log('logout', action.payload)
        state.loading = false
        state.authToken = undefined
        state.isLoggedIn = false
        localStorage.removeItem('authToken')
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.data?.message
      })
      .addCase(forgotPassword.pending, (state, action) => {
        state.loading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.data?.message
      })
      .addCase(resetPassword.pending, (state, action) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.data?.message
      })
  },
})

export const { setUser } = authSlice.actions

export default authSlice.reducer
