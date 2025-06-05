import React, { useState } from 'react'
import SampleDashboardTrendGraph from '@/Components/Dashboard/SampleDashboard/SampleDashboardTrendGraph'

export default function TestPage() {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(new Date())

  return (
    <div className='p-4'>
      <SampleDashboardTrendGraph
        cardTitle='Sample Trend'
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        subsetId={90}
        dataField='value'
        dataFieldName='Value'
        chartType='area' // or "bar"
        // Optional props:
        // filterFieldName="category"
        // filterListKey="name"
        // filterListFetchURL="/api/categories"
        // defaultFilterValue="Default"
      />
    </div>
  )
}
