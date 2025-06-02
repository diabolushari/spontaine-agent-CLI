'use client'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/Components/ui/chart'

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export function SampleChart({ dimensions }: { dimensions?: Record<string, string> }) {
  const classNames = [
    dimensions?.padding_top,
    dimensions?.padding_bottom,
    dimensions?.margin_top,
    dimensions?.margin_bottom,
    dimensions?.mobile_width,
    dimensions?.tablet_width,
    dimensions?.laptop_width,
    dimensions?.desktop_width,
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <ChartContainer
      config={chartConfig}
      className={classNames}
    >
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='month'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator='dot' />}
        />
        <Area
          dataKey='mobile'
          type='natural'
          fill='var(--color-mobile)'
          fillOpacity={0.4}
          stroke='var(--color-mobile)'
          stackId='a'
        />
        <Area
          dataKey='desktop'
          type='natural'
          fill='var(--color-desktop)'
          fillOpacity={0.4}
          stroke='var(--color-desktop)'
          stackId='a'
        />
      </AreaChart>
    </ChartContainer>
  )
}
