import React from 'react'
import { Database } from 'lucide-react'

interface QueryItemProps {
  title: string
  subtitle: string
  onClick: () => void
}

const QueryItem: React.FC<QueryItemProps> = ({ title, subtitle, onClick }) => {
  return (
    <button
      onClick={onClick}
      className='flex w-full items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-blue-400 hover:shadow-sm'
    >
      <div className='flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500'>
        <Database className='h-7 w-7 text-white' />
      </div>
      <div className='flex flex-col items-start'>
        <h3 className='text-base font-semibold text-gray-900'>{title}</h3>
        <p className='text-sm text-gray-500'>{subtitle}</p>
      </div>
    </button>
  )
}

export default QueryItem
