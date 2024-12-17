import ArriersHT from '@/Components/Financial/ArriersSummary/ArriersHT'
import ArriersLT from '@/Components/Financial/ArriersSummary/ArriersLT'
import TotalCollected from '@/Components/Finance/TotalCollected'
import TotalBilled from '@/Components/Financial/TotalBilled/TotalBilled'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import React, { useState } from 'react'
import ArrearsCountAndGraph from '@/Components/Finance/ArrearsCountAndGraph'

const FinanceIndexPage = () => {
  const [sectionCode, setSectionCode] = useState('')
  const [levelName, setLevelName] = useState('')
  const [levelCode, setLevelCode] = useState('')

  return (
    <DashboardLayout
      sectionCode={sectionCode}
      setSectionCode={setSectionCode}
      levelName={levelName}
      setLevelName={setLevelName}
      levelCode={levelCode}
      setLevelCode={setLevelCode}
      type='FINANCIAL STATS'
    >
      <DashboardPadding>
        <div className='flex flex-col gap-5 pt-8 sm:pt-24 md:pl-10'>
          <div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
            <TotalBilled />
            <TotalCollected />
          </div>
          <div className='flex flex-col gap-2 lg:flex-row'>
            <div className='flex w-full'>
              <ArrearsCountAndGraph />
            </div>
          </div>
          <div className='flex flex-col gap-2 lg:flex-row'>
            <ArriersHT />
            <ArriersLT />
          </div>
        </div>
      </DashboardPadding>
    </DashboardLayout>
  )
}

export default FinanceIndexPage
