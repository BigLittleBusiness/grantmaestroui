import React from 'react'
import ReportsTab from './ReportsTab'

export default function GrantTabs({ viewOnly = false }) {
  return (
    <>
      <ReportsTab viewOnly={viewOnly} />
    </>
  )
}
