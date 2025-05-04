import SimpleAreaChart from '@/Components/Charts/SimpleAreaChart'
import SimpleBarChart from '@/Components/Charts/SimpleBarChart'
import SimpleLineChart from '@/Components/Charts/SimpleLineChart'
import SimplePieChart from '@/Components/Charts/SimplePieChart'
import { useMemo } from 'react'
import { ChatMessage } from './MainArea'

export interface ChartData {
  key?: 'line' | 'bar' | 'pie' | 'area'
  label_field?: string
  value_field?: string
  visualization_title?: string
  label_field_title?: string
  value_field_title?: string
  data?: Record<string, number | string | null>[]
}

interface Props {
  message: ChatMessage
}

function extractChartDataFromMarkdown(markdown: string): ChartData[] {
  // Extract JSON code block from markdown
  try {
    const parsed = JSON.parse(markdown)
    if (Array.isArray(parsed)) {
      return parsed as ChartData[]
    }
  } catch (e) {
    // Invalid JSON
    return []
  }
  return []
}

export default function ChatVisualization({ message }: Readonly<Props>) {
  const charts = useMemo(() => {
    if (message.content == null || message.content === '') {
      return null
    }
    return extractChartDataFromMarkdown(message.content)
  }, [message])

  return (
    <div className='flex w-full flex-col gap-6'>
      {charts?.length === 0 && (
        <div className='h-96 w-full'>
          <p>Failed to parse chart data</p>
        </div>
      )}
      {charts?.map((chartData, idx) => (
        <div
          key={idx}
          className='h-96 w-full'
        >
          {chartData.key === 'bar' && (
            <SimpleBarChart
              chartData={chartData.data ?? []}
              dataKey={chartData.label_field ?? ''}
              dataFieldName={chartData.value_field ?? ''}
              color={'#3b82f6'}
              title={chartData.visualization_title ?? ''}
              xLabel={chartData.label_field_title ?? ''}
              yLabel={chartData.value_field_title ?? ''}
            />
          )}
          {chartData.key === 'area' && (
            <SimpleAreaChart
              chartData={chartData.data ?? []}
              dataKey={chartData.label_field ?? ''}
              dataFieldName={chartData.value_field ?? ''}
              title={chartData.visualization_title ?? ''}
              xLabel={chartData.label_field_title ?? ''}
              yLabel={chartData.value_field_title ?? ''}
            />
          )}
          {chartData.key === 'pie' && (
            <SimplePieChart
              chartData={chartData.data ?? []}
              dataKey={chartData.label_field ?? ''}
              dataFieldName={chartData.value_field ?? ''}
              color={'#3b82f6'}
              title={chartData.visualization_title ?? ''}
            />
          )}
          {chartData.key === 'line' && (
            <SimpleLineChart
              chartData={chartData.data ?? []}
              dataKey={chartData.label_field ?? ''}
              dataFieldName={chartData.value_field ?? ''}
              color={'#3b82f6'}
              title={chartData.visualization_title ?? ''}
              xLabel={chartData.label_field_title ?? ''}
              yLabel={chartData.value_field_title ?? ''}
            />
          )}
        </div>
      ))}
    </div>
  )
}
