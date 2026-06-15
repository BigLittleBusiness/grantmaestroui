import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api'
import toast from 'react-hot-toast'

const initialState = {
  loading: false,
  error: null,
  tickets: [],
  ticketInfo: {},
  // Pin Payments admin config
  pinSettings: {},
  pinSettingsLoading: false,
  pinTestResult: null,
}

export const fetchtickets = createAsyncThunk(
  'settings/fetchtickets',
  async (searchStr, { rejectWithValue }) => {
    try {
      const response = await api.get(`ticket/ticket-list`)
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Async thunk to fetch a single ticket by ID
export const getTicketInfo = createAsyncThunk(
  'settings/getTicketInfo',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await api.get(`ticket/ticket-detail/${ticketId}`)
      if (response?.data?.status === false) {
        return rejectWithValue({ message: 'Support ticket not found' })
      }
      const ticket = response.data?.data?.ticketDetail
      if (!ticket) {
        return rejectWithValue({ message: 'Support ticket not found' })
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const manageTicket = createAsyncThunk(
  'settings/manageTicket',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(`ticket/ticket-manage`, formData)
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      toast.success(response?.data?.message, { duration: 3000 })
      return { ticket: response.data?.data?.ticketDetail }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateTicketStatus = createAsyncThunk(
  'settings/updateTicketStatus',
  async (inputData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `ticket/ticket-status-update/${inputData.ticket_id}`,
        inputData
      )
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      toast.success(response?.data?.message, { duration: 3000 })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteSupportTicket = createAsyncThunk(
  'settings/deleteSupportTicket',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`ticket/ticket-remove/${ticketId}`)
      if (response?.data?.status === false) {
        return rejectWithValue({ message: 'unable to process your request' })
      }
      return { ...response.data, ticketId: ticketId }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// ---------------------------------------------------------------------------
// Pin Payments – System Admin thunks
// ---------------------------------------------------------------------------

export const fetchPinSettings = createAsyncThunk(
  'settings/fetchPinSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('admin/pin-settings/fetch')
      if (response?.data?.status === false) return rejectWithValue(response.data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const savePinSettings = createAsyncThunk(
  'settings/savePinSettings',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('admin/pin-settings/save', formData)
      if (response?.data?.status === false) return rejectWithValue(response.data)
      toast.success(response?.data?.message || 'Pin Payments settings saved.', { duration: 3000 })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const testPinConnection = createAsyncThunk(
  'settings/testPinConnection',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('admin/pin-settings/test-connection')
      if (response?.data?.status === false) return rejectWithValue(response.data)
      toast.success('Connection to Pin Payments API successful!', { duration: 3000 })
      return response.data
    } catch (error) {
      const msg = error.response?.data?.message || 'Connection test failed.'
      toast.error(msg, { duration: 4000 })
      return rejectWithValue(error.response?.data)
    }
  }
)

// ---------------------------------------------------------------------------
// Pin Payments – Customer charge thunk
// ---------------------------------------------------------------------------

export const createPinCharge = createAsyncThunk(
  'settings/createPinCharge',
  async (inputData, { rejectWithValue }) => {
    try {
      const response = await api.post('subscription/create-charge', inputData)
      if (response?.data?.status === false) return rejectWithValue(response.data)
      toast.success(response?.data?.message || 'Payment successful!', { duration: 4000 })
      return response.data
    } catch (error) {
      const msg = error.response?.data?.message || 'Payment failed.'
      toast.error(msg, { duration: 4000 })
      return rejectWithValue(error.response?.data)
    }
  }
)

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    crearSupportTicket: (state) => {
      state.ticketInfo = {}
    },
    clearPinTestResult: (state) => {
      state.pinTestResult = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Tickets
      .addCase(manageTicket.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(manageTicket.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        const index = state.tickets.findIndex(
          (ticket) => ticket.ticket_id === action.payload?.ticket?.ticket_id
        )
        if (index !== -1) {
          state.tickets[index] = action.payload?.data?.ticket
        }
      })
      .addCase(manageTicket.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })
      .addCase(fetchtickets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchtickets.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.tickets = action.payload?.data?.tickets
      })
      .addCase(fetchtickets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error
      })
      .addCase(getTicketInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getTicketInfo.fulfilled, (state, action) => {
        state.loading = false
        state.ticketInfo = action.payload?.data?.ticketDetail
      })
      .addCase(getTicketInfo.rejected, (state) => {
        state.loading = false
      })
      .addCase(updateTicketStatus.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteSupportTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter(
          (ticket) => ticket.ticket_id !== action.payload?.ticketId
        )
        toast.success('Ticket deleted successfully', { duration: 4000 })
      })
      // Pin Payments – admin settings
      .addCase(fetchPinSettings.pending, (state) => {
        state.pinSettingsLoading = true
      })
      .addCase(fetchPinSettings.fulfilled, (state, action) => {
        state.pinSettingsLoading = false
        state.pinSettings = action.payload?.data || {}
      })
      .addCase(fetchPinSettings.rejected, (state) => {
        state.pinSettingsLoading = false
      })
      .addCase(savePinSettings.pending, (state) => {
        state.pinSettingsLoading = true
      })
      .addCase(savePinSettings.fulfilled, (state) => {
        state.pinSettingsLoading = false
      })
      .addCase(savePinSettings.rejected, (state) => {
        state.pinSettingsLoading = false
      })
      .addCase(testPinConnection.pending, (state) => {
        state.pinSettingsLoading = true
        state.pinTestResult = null
      })
      .addCase(testPinConnection.fulfilled, (state, action) => {
        state.pinSettingsLoading = false
        state.pinTestResult = { success: true, data: action.payload?.data }
      })
      .addCase(testPinConnection.rejected, (state, action) => {
        state.pinSettingsLoading = false
        state.pinTestResult = { success: false, message: action.payload?.message }
      })
  },
})

export const { crearSupportTicket, clearPinTestResult } = settingsSlice.actions

export default settingsSlice.reducer
