import React from 'react'

const CardComponent = ({
  title,
  count,
  progress,
  progressLabel,
  progressValue,
  progressMax,
  change,
  changeLabel,
  cardClassName,
  iconClassName,
}) => {
  return (
    <div className={`card ${cardClassName}`}>
      <div className='card-body'>
        <div className='text-center'>
          <span className='dash-widget-icon bg-1'>
            <i className={iconClassName}></i>
          </span>
          <div className='dash-count'>
            <div className='dash-title'>{title}</div>
            <div className='dash-counts'>
              <p>{count}</p>
            </div>
          </div>
        </div>
        {/* <div
          className='progress progress-sm mt-3'
          style={{ width: '100%', background: '#fff' }}
        >
          <div
            className='progress-bar bg-1'
            role='progressbar'
            style={{ width: `${progress}%` }}
            aria-valuenow={progressValue}
            aria-valuemin='0'
            aria-valuemax={progressMax}
          ></div>
        </div> */}
        {/* <p className='text-muted mt-3 mb-0'>
          <span className='text-primary me-1'>
            <i className='fa fa-arrow-up me-1'></i>
            {change}%
          </span>{' '}
          {changeLabel}
        </p> */}
      </div>
    </div>
  )
}

export default CardComponent
