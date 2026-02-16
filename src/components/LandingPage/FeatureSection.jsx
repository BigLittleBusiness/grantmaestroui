import React from 'react'

const featureList = {
  universites: [
    {
      title: 'PI Collaboration Portals',
      description:
        'Secure spaces for research teams to upload docs and track progress.',
    },
    {
      title: 'REF/ERA Compliance',
      description: 'Auto-generate impact reports for audit season.',
    },
  ],
  councils: [
    {
      title: 'Team Collaboration',
      description:
        'Create team members, give them tasks to help complete grants more efficiently! ',
    },
    {
      title: 'Centralise all Grant Data ',
      description:
        'Requirement docs, images, reports, spreadsheets can all be save in one central location for each grant ',
    },
  ],
  nonProfit: [
    {
      title: 'Never Miss a Deadline',
      description:
        'AI-powered alerts remind you when reports are due—no more lost funding.',
    },
    {
      title: 'Audit-Ready Records',
      description:
        'All documents in one place, tagged for ACNC/Charity Commission compliance.',
    },
    {
      title: 'Team Collaboration',
      description:
        'Assign tasks to fundraisers, program staff, and finance—all in sync.',
    },
  ],
  religiousPage: [
    {
      title: 'Mission-Aligned Grant Tracking',
      description:
        'Tag grants by outreach focus (e.g., homelessness, youth) to ensure alignment with your values.',
    },
    {
      title: 'Donor Transparency',
      description:
        'Generate faith-friendly reports showing how funds transform lives.',
    },
    {
      title: 'Volunteer Coordination',
      description:
        'Assign grant-related tasks to staff and volunteers in one place.',
    },
  ],
  homepage: [],
}
export default function FeatureSection({ landingPage = 'homepage' }) {
  const features = landingPage && featureList ? featureList[landingPage] : []

  const renderFeatureCards = () =>
    features.map((feature, index) => (
      <div className='feature-card' key={index}>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </div>
    ))
  return <section class='container features'>{renderFeatureCards()}</section>
}
