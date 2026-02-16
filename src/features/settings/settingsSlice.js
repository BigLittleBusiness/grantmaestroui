import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api'
import toast from 'react-hot-toast'

const initialState = {
  loading: false,
  error: null,
  tickets: [],
  ticketInfo: {},
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

      console.log(response.data)
      toast.success(response?.data?.message, {
        duration: 3000,
      })
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

      console.log(response.data)
      toast.success(response?.data?.message, {
        duration: 3000,
      })
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

export const createCheckoutSession = createAsyncThunk(
  'settings/createCheckoutSession',
  async (inputData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `subscription/create-checkout-session`,
        inputData
      )
      const session = response?.data?.data
      window.location.href = session.url
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

//Create settings slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    crearSupportTicket: (state, action) => {
      state.ticketInfo = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(manageTicket.pending, (state, action) => {
        state.loading = true
        state.error = null
      })
      .addCase(manageTicket.fulfilled, (state, action) => {
        console.log(action.payload)
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
        state.error = action.payload.message
      })
      .addCase(fetchtickets.pending, (state, action) => {
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
        state.error = action.payload.error
      })
      .addCase(getTicketInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getTicketInfo.fulfilled, (state, action) => {
        console.log(action.payload)
        state.loading = false
        state.ticketInfo = action.payload?.data?.ticketDetail
      })
      .addCase(getTicketInfo.rejected, (state, action) => {
        state.loading = false
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(deleteSupportTicket.fulfilled, (state, action) => {
        console.log(action.payload)
        state.tickets = state.tickets.filter(
          (ticket) => ticket.ticket_id !== action.payload?.ticketId
        )
        toast.success('Ticket deleted successfully', {
          duration: 4000,
        })
      })
  },
})

export const { crearSupportTicket } = settingsSlice.actions

export default settingsSlice.reducer
