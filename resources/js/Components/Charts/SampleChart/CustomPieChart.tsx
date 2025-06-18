'use client'

import * as React from 'react'
import { Pie, PieChart, Label } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/Components/ui/chart'

const piData = {
  values: [
    { name: 'Page A', uv: 4000, fill: 'hsl(var(--chart-1))' },
    { name: 'Page B', uv: 3000, fill: 'hsl(var(--chart-2))' },
    { name: 'Page C', uv: 2000, fill: 'hsl(var(--chart-3))' },
    { name: 'Page D', uv: 2780, fill: 'hsl(var(--chart-4))' },
    { name: 'Page E', uv: 1890, fill: 'hsl(var(--chart-5))' },
    { name: 'Page F', uv: 2390, fill: 'hsl(var(--chart-6))' },
    { name: 'Page G', uv: 3490, fill: 'hsl(var(--chart-7))' },
  ],
  label: 'SLA',
  dataKey: 'uv',
  nameKey: 'name',
}

const chartConfig = {
  uv: {
    label: 'UV',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function CustomPieChart() {
  const totalVisitors = React.useMemo(() => {
    return piData.values.reduce((acc, curr) => acc + curr.uv, 0)
  }, [])

  return (
    <ChartContainer
      config={chartConfig}
      className='mx-auto aspect-square max-h-[250px]'
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={piData.values}
          dataKey={piData.dataKey}
          nameKey={piData.nameKey}
          innerRadius={60}
          strokeWidth={5}
          label={true}
          labelLine={false}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor='middle'
                    dominantBaseline='middle'
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className='fill-foreground text-3xl font-bold'
                    ></tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className='fill-muted-foreground'
                    >
                      {piData.label}
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
