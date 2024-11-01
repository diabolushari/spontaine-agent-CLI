import useFetchList from '@/hooks/useFetchList'
import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}

export interface PowerInterruptionValues {
  request_date: string
  powerfailures: number
}

const PowerInterruptionTrend = ({ section_code, levelName, levelCode }: Properties) => {
  const [graphValues] = useFetchList<PowerInterruptionValues>(`subset/33?${levelName}=${levelCode}`)
  const [chartData, setChartData] = useState<{ day: string; interruptions: number }[]>([])

  useEffect(() => {
    if (graphValues && graphValues.length > 0) {
      const sortedData = [...graphValues].sort(
        (a, b) => new Date(b.request_date).getTime() - new Date(a.request_date).getTime()
      )

      const formattedData = sortedData.map((item, index) => ({
        day: `Day ${index + 1}`,
        interruptions: item.powerfailures,
      }))

      setChartData(formattedData)
    }
  }, [graphValues])

  return (
    <div className='w-full rounded-lg p-4'>
      <p className='h3-1stop mb-6'>10-day Power Interruption Trend</p>
      <div className='pl-5'>
        <ResponsiveContainer
          width='100%'
          height={300}
        >
          <AreaChart data={chartData}>
            <XAxis
              dataKey='day'
              className='axial-label-1stop'
            />
            <YAxis hide />
            <Tooltip />
            <Area
              type='monotone'
              dataKey='interruptions'
              stroke='#0091ff'
              fill='var(--colour-chart-3)'
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PowerInterruptionTrend
