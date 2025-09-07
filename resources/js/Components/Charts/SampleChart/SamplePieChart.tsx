'use client'

import { Cell, Legend, Pie, PieChart } from 'recharts'
import { chartPallet } from '@/Components/Charts/SampleChart/ColorPallets'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/Components/ui/chart'

interface Props {
  data: Record<string, number | string>[]
  dataKey: string
  nameKey: string
  keysToPlot: {
    key: string
    label: string
    unit?: string
  }[]
  colorScheme?: string
  fontSize: string
  sliceCount?: number
  sortOrder?: 'ascending' | 'descending'
}

export function CustomPieChart({
  data,
  dataKey,
  nameKey,
  keysToPlot,
  colorScheme = 'boldWarm',
  fontSize,
}: Readonly<Props>) {
  const chartColors: string[] = chartPallet[colorScheme as keyof typeof chartPallet] ?? []

  const chartConfig = keysToPlot.reduce((acc, plotKey, index) => {
    acc[plotKey.key] = {
      label: plotKey.label,
      color: chartColors[index % chartColors.length],
    }
    return acc
  }, {} as ChartConfig)

  return (
    <ChartContainer
      config={chartConfig}
      className={`${fontSize} h-[400px]`}
    >
      <PieChart>
        <Legend />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={40}
          outerRadius={80}
          strokeWidth={1}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={chartColors[index % chartColors.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
