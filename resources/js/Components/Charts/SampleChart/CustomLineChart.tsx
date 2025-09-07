'use client'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/Components/ui/chart'
import { chartPallet } from '@/Components/Charts/SampleChart/ColorPallets'
import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'

const tickFormatter = (value: number | string) => {
  const str = String(value)
  return str.length > 10 ? str.substring(0, 7) + '...' : str
}

interface Props {
  data: Record<string, number | string>[]
  dataKey: string
  keysToPlot: {
    key: string
    label: string
    unit?: string
  }[]
  colorScheme?: string
  xAxisLabel?: string
  yAxisLabel?: string
  fontSize?: string
  sliceCount?: number
  displayKey?: string
  displayKeyShow?: boolean
  sortOrder?: 'ascending' | 'descending'
}

export function CustomLineChart({
  data,
  dataKey,
  keysToPlot,
  colorScheme = 'boldWarm',
  xAxisLabel,
  yAxisLabel,
  fontSize = '',
}: Readonly<Props>) {
  const chartColors: string[] = chartPallet[colorScheme as keyof typeof chartPallet] ?? []

  const chartConfig = keysToPlot.reduce((acc, plotKey, index) => {
    const unit = plotKey.unit ? ` (${plotKey.unit})` : ''
    acc[plotKey.key] = {
      label: `${plotKey.label}${unit}`,
      color: chartColors[index % chartColors.length],
    }
    return acc
  }, {} as ChartConfig)

  return (
    <ChartContainer
      config={chartConfig}
      className={fontSize}
    >
      <ResponsiveContainer
        width='100%'
        height={300}
      >
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={dataKey}
            tickLine={false}
            tickMargin={15}
            axisLine={false}
            type='category'
            interval='preserveStartEnd'
            angle={-45}
            textAnchor='end'
            height={70}
            tick={{ fontSize: 12 }}
            tickFormatter={tickFormatter}
          />

          <YAxis
            tickFormatter={(value) => (formatNumber(value as number) ?? '').toString()}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />

          <ChartTooltip content={<ChartTooltipContent />} />

          {keysToPlot.map((plotKey, index) => (
            <Line
              key={plotKey.key}
              dataKey={plotKey.key}
              name={plotKey.label}
              type='monotone'
              stroke={chartColors[index % chartColors.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
