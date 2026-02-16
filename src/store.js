import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from 'features/tasks/tasksSlice'
import teamReducer from 'features/teamMember/teamMemberSlice'
import authReducer from 'features/auth/authSlice'
import grantReducer from 'features/grant/grantSlice'
import settingsReducer from 'features/settings/settingsSlice'

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    teamMember: teamReducer,
    auth: authReducer,
    grant: grantReducer,
    settings: settingsReducer
  },
})

export default store