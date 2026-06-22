import React from 'react'
import { useSelector } from 'react-redux'
import CardComponent from 'components/CardComponent'

export default function CardsComponent() {
  const grants = useSelector((state) => state.grant?.grants ?? [])

  const openGrants = grants?.filter((g) => new Date(g.closingDate) > new Date())

  const appliedGrants = grants?.filter(
    (g) => g.submissionDate && g.submissionDate.trim() !== ''
  )
  const appliedGrantsAmount = grants
    ?.filter((g) => g.submissionDate && g.submissionDate.trim() !== '')
    .reduce((sum, gr) => sum + (parseFloat(gr.funding_sought_amount) || 0), 0)

  const totalGrantsAmount = grants
    ?.filter(
      (g) =>
        g.submissionDate &&
        g.submissionDate?.trim() !== '' &&
        g.outcome?.toLowerCase() === 'won'
    )
    .reduce((sum, gr) => sum + (parseFloat(gr.funding_sought_amount) || 0), 0)

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const openGrantsLastWeek = grants?.filter(
    (g) => new Date(g.closingDate) > oneWeekAgo
  )

  const openGrantsChange =
    openGrants?.length && openGrantsLastWeek?.length
      ? (
          ((openGrants?.length - openGrantsLastWeek?.length) /
            openGrantsLastWeek?.length) *
          100
        ).toFixed(2)
      : 0

  return (
    <div className='row'>
      <div className='col-xl-3 col-sm-6 col-12'>
        <CardComponent
          title='Open Grants'
          count={openGrants?.length || 0}
          progress='75'
          progressValue='75'
          progressMax='100'
          change={openGrantsChange}
          changeLabel='since last week'
          cardClassName='card-purple'
          iconClassName='fa fa-cube'
        />
      </div>
      <div className='col-xl-3 col-sm-6 col-12'>
        <CardComponent
          title='Applied'
          count={appliedGrants?.length || 0}
          progress='65'
          progressValue='65'
          progressMax='100'
          change='2.37'
          changeLabel='since last week'
          cardClassName='card-blue'
          iconClassName='fa fa-check'
        />
      </div>
      <div className='col-xl-3 col-sm-6 col-12'>
        <CardComponent
          title='Applied Value'
          count={`$${appliedGrantsAmount}`}
          progress='85'
          progressValue='85'
          progressMax='100'
          change='3.77'
          changeLabel='since last week'
          cardClassName='card-pink'
          iconClassName='fa fa-file-o'
        />
      </div>
      <div className='col-xl-3 col-sm-6 col-12'>
        <CardComponent
          title='Total Grant Amount'
          count={`$${totalGrantsAmount}`}
          progress='85'
          progressValue='85'
          progressMax='100'
          change='3.77'
          changeLabel='since last week'
          cardClassName='card-green'
          iconClassName='fa fa-dollar'
        />
      </div>
    </div>
  )
}
