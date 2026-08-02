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
  // Subscription Plans admin
  adminPlans: [],
  adminPlansLoading: false,
  // Promo Codes admin
  promoCodes: [],
  promoCodesLoading: false,
  // Email Settings admin
  emailSettings: {},
  emailSettingsLoading: false,
  emailTestResult: null,
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
// Subscription Plans – Admin thunks
// ---------------------------------------------------------------------------

export const fetchAdminPlans = createAsyncThunk(
  'settings/fetchAdminPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('admin/plans')
      if (response?.data?.status === false) return rejectWithValue(response.data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const updateAdminPlan = createAsyncThunk(
  'settings/updateAdminPlan',
  async ({ plan_id, ...data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`admin/plans/${plan_id}`, data)
      if (response?.data?.status === false) return rejectWithValue(response.data)
      toast.success('Plan updated successfully.', { duration: 3000 })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// ---------------------------------------------------------------------------
// Promo Codes – Admin thunks
// ---------------------------------------------------------------------------

export const fetchPromoCodes = createAsyncThunk(
  'settings/fetchPromoCodes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('admin/promo-codes')
      if (response?.data?.status === false) return rejectWithValue(response.data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const createPromoCode = createAsyncThunk(
  'settings/createPromoCode',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('admin/promo-codes', formData)
      if (response?.data?.status === false) return rejectWithValue(response.data)
      toast.success('Promo code created.', { duration: 3000 })
      return response.data
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create promo code.'
      toast.error(msg, { duration: 4000 })
      return rejectWithValue(error.response?.data)
    }
  }
)

export const deletePromoCode = createAsyncThunk(
  'settings/deletePromoCode',
  async (promo_id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`admin/promo-codes/${promo_id}`)
      if (response?.data?.status === false) return rejectWithValue(response.data)
      toast.success('Promo code deleted.', { duration: 3000 })
      return { promo_id }
    } catch (error) {
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
// Email Settings – Admin thunks
// ---------------------------------------------------------------------------

export const fetchEmailSettings = createAsyncThunk(
  'settings/fetchEmailSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('admin/email-settings/fetch')
      if (response?.data?.status === false) return rejectWithValue(response.data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const saveEmailSettings = createAsyncThunk(
  'settings/saveEmailSettings',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('admin/email-settings/save', formData)
      if (response?.data?.status === false) return rejectWithValue(response.data)
      toast.success('Email settings saved.', { duration: 3000 })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const testEmailSettings = createAsyncThunk(
  'settings/testEmailSettings',
  async ({ to }, { rejectWithValue }) => {
    try {
      const response = await api.post('admin/email-settings/test', { to })
      if (response?.data?.status === false) return rejectWithValue(response.data)
      return response.data
    } catch (error) {
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
      // Subscription Plans admin
      .addCase(fetchAdminPlans.pending, (state) => { state.adminPlansLoading = true })
      .addCase(fetchAdminPlans.fulfilled, (state, action) => {
        state.adminPlansLoading = false
        state.adminPlans = action.payload?.data || []
      })
      .addCase(fetchAdminPlans.rejected, (state) => { state.adminPlansLoading = false })
      .addCase(updateAdminPlan.fulfilled, (state, action) => {
        const updated = action.payload?.data
        if (updated) {
          const idx = state.adminPlans.findIndex(p => p.plan_id === updated.plan_id)
          if (idx !== -1) state.adminPlans[idx] = updated
        }
      })
      // Promo Codes admin
      .addCase(fetchPromoCodes.pending, (state) => { state.promoCodesLoading = true })
      .addCase(fetchPromoCodes.fulfilled, (state, action) => {
        state.promoCodesLoading = false
        state.promoCodes = action.payload?.data || []
      })
      .addCase(fetchPromoCodes.rejected, (state) => { state.promoCodesLoading = false })
      .addCase(createPromoCode.fulfilled, (state, action) => {
        if (action.payload?.data) state.promoCodes.unshift(action.payload.data)
      })
      .addCase(deletePromoCode.fulfilled, (state, action) => {
        state.promoCodes = state.promoCodes.filter(p => p.promo_id !== action.payload.promo_id)
      })
      // Email Settings admin
      .addCase(fetchEmailSettings.pending, (state) => { state.emailSettingsLoading = true })
      .addCase(fetchEmailSettings.fulfilled, (state, action) => {
        state.emailSettingsLoading = false
        state.emailSettings = action.payload?.data || {}
      })
      .addCase(fetchEmailSettings.rejected, (state) => { state.emailSettingsLoading = false })
      .addCase(saveEmailSettings.pending, (state) => { state.emailSettingsLoading = true })
      .addCase(saveEmailSettings.fulfilled, (state, action) => {
        state.emailSettingsLoading = false
        if (action.payload?.data) state.emailSettings = action.payload.data
      })
      .addCase(saveEmailSettings.rejected, (state) => { state.emailSettingsLoading = false })
      .addCase(testEmailSettings.fulfilled, (state, action) => {
        state.emailTestResult = action.payload || { success: true }
      })
      .addCase(testEmailSettings.rejected, (state, action) => {
        state.emailTestResult = { success: false, message: action.payload?.message || 'Test failed.' }
      })
  },
})

export const { crearSupportTicket, clearPinTestResult, clearEmailTestResult } = settingsSlice.actions

export default settingsSlice.reducer
