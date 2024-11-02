import React from 'react'

interface Properties {
  svgStyle: string
  svgSize?: string
}

export default function Spinner({ svgStyle, svgSize = 'w-14 h-14' }: Properties) {
  return (
    <span className={svgStyle}>
      <svg
        className={`spinner_svg ${svgSize}`}
        viewBox='0 0 100 100'
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle
          className='spinner_circle'
          stroke='currentColor'
          fill='var(--colour-1stop-accent2)'
          cx='50'
          cy='50'
          r='45'
        />
      </svg>
    </span>
  )
}
