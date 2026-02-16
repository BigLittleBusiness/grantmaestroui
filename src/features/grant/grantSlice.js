import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api'
import toast from 'react-hot-toast'

// Define the initial state with mock data
const initialState = {
  grants: [],
  grant: {},
  loading: false,
  error: null,
  notes: [],
  files: [],
  expense: {},
  report: {},
  events: [],
  grantCategory: [],
}

export const fetchGrants = createAsyncThunk(
  'grants/fetchGrants',
  async (searchStr, { rejectWithValue }) => {
    let url = 'grant-list?'
    if (searchStr.grantTitle) {
      url = `${url}grant_title=${searchStr.grantTitle}`
    }
    if (searchStr.maxFundAmount) {
      url = `${url}&max_fund_amount=${searchStr.maxFundAmount}`
    }
    if (searchStr.grantSoughtAmount) {
      url = `${url}&sought_amount=${searchStr.grantSoughtAmount}`
    }
    if (searchStr.openingStartDate && searchStr.openingEndDate) {
      url = `${url}&opening_start=${searchStr.openingStartDate}&opening_end=${searchStr.openingEndDate}`
    }
    if (searchStr.closingStartDate && searchStr.closingEndDate) {
      url = `${url}&closing_start=${searchStr.closingStartDate}&closing_end=${searchStr.closingEndDate}`
    }
    if (searchStr.closingDate) {
      url = `${url}&closing_date=${searchStr.closingDate}`
    }
    if (searchStr.grantStatus) {
      url = `${url}&grant_status=${searchStr.grantStatus}`
    }
    if (searchStr.grantOutcome) {
      url = `${url}&outcome=${searchStr.grantOutcome}`
    }

    try {
      const response = await api.get(`grant/${url}`)
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchGrantCategoryList = createAsyncThunk(
  'grants/fetchGrantCategoryList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('category/grant-category-list')
      if (response?.data?.status === false) {
        return rejectWithValue({ message: 'Grant Category not found' })
      }

      const grantCategory = response.data?.data?.grantCategory
      if (!grantCategory) {
        return rejectWithValue({ message: 'Grant Category not found' })
      }
      return { data: { grantCategory } }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Async thunk to fetch a single grant by ID
export const fetchGrant = createAsyncThunk(
  'grants/fetchGrant',
  async (grantId, { rejectWithValue }) => {
    try {
      const response = await api.get(`grant/grant-details/${grantId}`)
      if (response?.data?.status === false) {
        return rejectWithValue({ message: 'Grant not found' })
      }

      const grant = response.data?.data?.grantInfo
      if (!grant) {
        return rejectWithValue({ message: 'Grant not found' })
      }
      return { data: { grant } }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const createGrant = createAsyncThunk(
  'grants/createGrant',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(`grant/grant-add`, formData)

      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Async thunk to update an existing grant
export const updateGrant = createAsyncThunk(
  'grants/updateGrant',
  async (formData, { rejectWithValue }) => {
    try {
      console.log('grantValues', formData)
      const response = await api.post(
        `grant/grant-update/${formData.id}`,
        formData.values
      )
      if (response?.data?.status === false) {
        return rejectWithValue({ message: 'Grant not found' })
      }

      const grant = response.data?.data?.grantInfo
      if (!grant) {
        return rejectWithValue({ message: 'Grant not found' })
      }
      return { data: { grant } }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const manageGrantExpenses = createAsyncThunk(
  'grant/manageGrantExpenses',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `grant/grant-expense-manage`,
        formData.values
      )
      if (response?.data?.status === false) {
        return rejectWithValue({ message: 'Grant not found' })
      }

      const expense = response.data?.data?.expense
      if (!expense) {
        return rejectWithValue({ message: 'Expense not found' })
      }
      return { data: { expense } }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const removeGrantExpenses = createAsyncThunk(
  'grant/removeGrantExpenses',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `grant/grant-expense-remove/${formData.expense_id}`
      )

      if (response?.data?.status === false) {
        return rejectWithValue({ message: response?.data?.message })
      }

      const expense = response.data?.data?.expense
      if (!expense) {
        return rejectWithValue({ message: 'Expense not found' })
      }
      return expense
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const manageGrantReport = createAsyncThunk(
  'grant/manageGrantReport',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `grant/grant-report-manage`,
        formData.values
      )
      if (response?.data?.status === false) {
        return rejectWithValue({ message: 'Grant not found' })
      }

      const report = response.data?.data?.grant_report
      if (!report) {
        return rejectWithValue({ message: 'Report not found' })
      }
      return { data: { report } }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const removeGrantReport = createAsyncThunk(
  'grant/removeGrantReport',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `grant/grant-report-remove/${formData.report_id}`
      )
      if (response?.data?.status === false) {
        return rejectWithValue({ message: response?.data?.message })
      }

      const report = response.data?.data?.report
      if (!report) {
        return rejectWithValue({ message: 'Expense not found' })
      }
      return report
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Async thunk to fetch a single grant by ID
export const fetchEvents = createAsyncThunk(
  'grants/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`dashboard/calendar-events`)
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Grant delete is not complete yet
export const deleteGrant = createAsyncThunk(
  'grants/deleteGrant',
  async (id) => {
    return id
  }
)

// Create the grant slice
const grantSlice = createSlice({
  name: 'grant',
  initialState,
  reducers: {
    updateGrantFinding: (state, action) => {
      state.grantFinding = action.payload
    },
    updateSuitability: (state, action) => {
      state.suitability = action.payload
    },
    updateSubmission: (state, action) => {
      state.submission = action.payload
    },
    updateOutcome: (state, action) => {
      state.outcome = action.payload
    },
    updateGrantReporting: (state, action) => {
      state.grantReporting = action.payload
    },
    updateFinancials: (state, action) => {
      state.financials = action.payload
    },
    addNote: (state, action) => {
      state.notes.push(action.payload)
    },
    addFile: (state, action) => {
      state.files.push(action.payload)
    },
    crearSingleGrant: (state, action) => {
      state.grant = {}
    },
    setSingleExpenseData: (state, action) => {
      state.expense = action.payload?.expense
    },
    setSingleReportData: (state, action) => {
      state.report = action.payload?.report
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGrants.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGrants.fulfilled, (state, action) => {
        state.loading = false
        state.grants = action.payload.data?.grants
      })
      .addCase(fetchGrants.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchGrant.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGrant.fulfilled, (state, action) => {
        // console.log('grant 2', action.payload.data.grant)
        state.loading = false
        state.grant = { ...action.payload.data.grant }
      })
      .addCase(fetchGrant.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchGrantCategoryList.fulfilled, (state, action) => {
        state.grantCategory = action.payload.data.grantCategory
      })
      .addCase(fetchGrantCategoryList.rejected, (state, action) => {
        state.grantCategory = []
      })
      .addCase(createGrant.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createGrant.fulfilled, (state, action) => {
        state.loading = false
        toast.success('Grant Created successfully', {
          duration: 4000,
        })
        state.grants.push(action.payload.data)
      })
      .addCase(createGrant.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateGrant.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateGrant.fulfilled, (state, action) => {
        state.loading = false
        const index = state.grants.findIndex(
          (grant) =>
            grant.id === action.payload?.data?.grant?.organization_grant_id
        )
        if (index !== -1) {
          state.grants[index] = action.payload?.data?.grant
        }
        state.grant = action.payload?.data?.grant
      })
      .addCase(updateGrant.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(deleteGrant.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(manageGrantExpenses.pending, (state) => {
        state.loading = true
      })
      .addCase(manageGrantExpenses.fulfilled, (state, action) => {
        // console.log(action.payload)
        state.loading = false
        const index = state.grant.item_expenses.findIndex(
          (expense) =>
            expense.expense_id === action.payload?.data?.expense?.expense_id
        )
        // console.log(index)
        if (index !== -1) {
          console.log('hererererere')
          state.grant.item_expenses[index] = action.payload?.data?.expense
        } else {
          state.grant.item_expenses.push(action.payload?.data?.expense)
        }
        state.expense = {}
      })
      .addCase(manageGrantExpenses.rejected, (state) => {
        state.loading = false
      })
      .addCase(removeGrantExpenses.fulfilled, (state, action) => {
        console.log(action.payload)
        const index = state.grant.item_expenses.findIndex(
          (expense) => expense.expense_id === action.payload?.expense_id
        )
        // console.log(index)
        if (index !== -1) {
          // state.grant.item_expenses[index] = action.payload?.data?.expense
          state.grant.item_expenses.splice(index, 1)
        }
      })
      .addCase(manageGrantReport.fulfilled, (state, action) => {
        state.loading = false
        const index = state.grant.reports.findIndex(
          (report) =>
            report.report_id === action.payload?.data?.report?.report_id
        )
        // console.log(index)
        if (index !== -1) {
          state.grant.reports[index] = action.payload?.data?.report
        } else {
          state.grant.reports.push(action.payload?.data?.report)
        }
        state.report = {}
        toast.success('Report Created successful!', {
          duration: 3000,
        })
      })
      .addCase(removeGrantReport.fulfilled, (state, action) => {
        console.log(action.payload)
        const index = state.grant.reports.findIndex(
          (report) => report.report_id === action.payload?.report_id
        )
        // console.log(index)
        if (index !== -1) {
          // state.grant.item_expenses[index] = action.payload?.data?.expense
          state.grant.reports.splice(index, 1)
        }
      })
      .addCase(deleteGrant.fulfilled, (state, action) => {
        state.loading = false
        state.grants = state.grants.filter(
          (grant) => grant.id !== action.payload
        )
      })
      .addCase(deleteGrant.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload.data.events
      })
  },
})

export const {
  updateGrantFinding,
  updateSuitability,
  updateSubmission,
  updateOutcome,
  updateGrantReporting,
  updateFinancials,
  addNote,
  addFile,
  crearSingleGrant,
  setSingleExpenseData,
  setSingleReportData,
} = grantSlice.actions

export default grantSlice.reducer
