import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/admin/signup', userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
