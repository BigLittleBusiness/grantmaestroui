import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api'
import toast from 'react-hot-toast'

const roleToMemberType = {
  admin: 1,
  team_member: 3,
  acquittal_contributor: 4,
}

// Fetch team members (list)
export const fetchTeamMembers = createAsyncThunk(
  'teamMember/fetchTeamMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`team-member/member-list`)
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Add a new team member
export const addTeamMember = createAsyncThunk(
  'teamMember/addTeamMember',
  async (teamMember, { rejectWithValue }) => {
    const member_type = roleToMemberType[teamMember.role]
    if (!member_type) {
      return rejectWithValue({ message: 'Please select a valid team role.' })
    }
    const payload = { ...teamMember, member_type }
    try {
      const response = await api.post(`team-member/member-add`, payload)
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Update an existing team member
export const updateTeamMember = createAsyncThunk(
  'teamMember/updateTeamMember',
  async (teamMember, { rejectWithValue }) => {
    let payload = teamMember
    try {
      const member_type = roleToMemberType[teamMember.role]
      if (!member_type) {
        return rejectWithValue({ message: 'Please select a valid team role.' })
      }
      payload = { ...teamMember, member_type }
      const response = await api.post(
        `team-member/member-update/${teamMember.user_id}`,
        payload
      )
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      toast.success(response?.data?.message, {
        duration: 4000,
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Fetch a single team member (view)
export const fetchTeamMember = createAsyncThunk(
  'teamMember/fetchTeamMember',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`team-member/member-details/${id}`)
      if (response?.data?.status === false) {
        return rejectWithValue(response.data)
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const filterTeamMembers = createAsyncThunk(
  'teamMember/filterTeamMembers',
  async (role, { rejectWithValue, getState }) => {
    try {
      const state = getState().teamMember
      let filteredMembers = []
      if (role === 'all') {
        filteredMembers = state.originalTeamMembers
      } else {
        const roleId = roleToMemberType[role]
        filteredMembers = state.originalTeamMembers.filter(
          (member) => member.user_role_id === roleId
        )
      }
      return { data: { memberList: filteredMembers } }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteTeamMember = createAsyncThunk(
  'tasks/deleteTeamMember',
  async (memberId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`team-member/member-remove/${memberId}`)
      if (response?.data?.status === false) {
        return rejectWithValue({ message: 'unable to process your request' })
      }
      return { ...response.data, memberId: memberId }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const teamMemberSlice = createSlice({
  name: 'teamMember',
  initialState: {
    teamMembers: [],
    originalTeamMembers: [],
    selectedTeamMember: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setSelectedTeamMember: (state, action) => {
      state.selectedTeamMember = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.originalTeamMembers = action.payload.data?.memberList
        state.teamMembers = action.payload.data?.memberList
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addTeamMember.fulfilled, (state, action) => {
        // console.log('addTeamMember', action.payload)
        state.teamMembers.push(action.payload?.data?.member)
        toast.success(action.payload?.message, {
          duration: 4000,
        })
      })
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        // console.log('updateTeamMember', action.payload)

        const updatedId = action.meta.arg.user_id
        const index = state.teamMembers.findIndex(
          (teamMember) => teamMember.user_id === Number(updatedId)
        )
        if (index !== -1) {
          state.teamMembers[index] = { ...state.teamMembers[index], ...action.meta.arg }
        }
      })
      .addCase(fetchTeamMember.fulfilled, (state, action) => {
        state.selectedTeamMember = action.payload.data?.userDetails
      })
      .addCase(filterTeamMembers.fulfilled, (state, action) => {
        state.teamMembers = action.payload.data.memberList
      })
      .addCase(deleteTeamMember.fulfilled, (state, action) => {
        // console.log(action.payload)
        state.teamMembers = state.teamMembers.filter(
          (member) => member.user_id !== action.payload.memberId
        )
        toast.success('Team member removed successfully', {
          duration: 4000,
        })
      })
  },
})

export const { setSelectedTeamMember } = teamMemberSlice.actions

export default teamMemberSlice.reducer
