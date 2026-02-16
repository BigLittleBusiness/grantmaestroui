import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api'
import toast from 'react-hot-toast'

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (searchText, { getState, rejectWithValue }) => {
    try {
      const response = await api.get('task/task-list') // ✅ Ensure cookies are sent
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchTask = createAsyncThunk(
  'tasks/fetchTask',
  async (taskId, { getState, rejectWithValue }) => {
    try {
      const response = await api.get(`task/task-details/${taskId}`) // ✅ Ensure cookies are sent
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const addNewTask = createAsyncThunk(
  'tasks/addNewTask',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(`task/task-assign`, formData.values) // ✅ Ensure cookies are sent
      if (response?.data?.status === false) {
        return rejectWithValue({ message: 'unable to process your request' })
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `task/task-update/${formData.task_id}`,
        formData
      ) // ✅ Ensure cookies are sent
      if (response?.data?.status === false) {
        return rejectWithValue({ message: 'unable to process your request' })
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`task/task-remove/${taskId}`) // ✅ Ensure cookies are sent
      if (response?.data?.status === false) {
        return rejectWithValue({ message: 'unable to process your request' })
      }
      return { ...response.data, taskId: taskId }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    selectedTask: null,
    status: 'idle',
    error: null,
    isLoading: false,
  },
  reducers: {
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.tasks = action.payload?.data?.tasks
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload?.data?.task)
        state.isLoading = false
        toast.success('Task assigned successfully', {
          duration: 4000,
        })
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload?.data?.task?.id
        )
        if (index !== -1) {
          state.tasks[index] = action.payload?.data?.task
        }
        toast.success('Task Updated successfully', {
          duration: 4000,
        })
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (task) => task.id !== action.payload.data.taskId
        )
        toast.success('Task deleted successfully', {
          duration: 4000,
        })
      })
      .addCase(fetchTask.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.selectedTask = action.payload?.data?.task
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.isLoading = false
        state.selectedTask = null
      })
  },
})

export const { setSelectedTask } = tasksSlice.actions

export default tasksSlice.reducer
