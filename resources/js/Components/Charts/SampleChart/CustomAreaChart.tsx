import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/Components/ui/chart'
import { BlockDimension } from '@/interfaces/data_interfaces'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { cn } from '@/lib/utils'

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

interface Props {
  data: Record<string, number | string>[]
  dataKey: string
  keysToPlot: {
    key: string
  }[]
  dimensions?: BlockDimension
  xAxisLabel?: string
  yAxisLabel?: string
  tooltipIndicator?: {
    label: string
    unit: string
    show_label: boolean
  }
}

export function CustomAreaChart({
  data,
  dataKey,
  keysToPlot,
  xAxisLabel,
  yAxisLabel,
  tooltipIndicator,
  dimensions,
}: Props) {
  const chartConfig = keysToPlot.reduce((acc, plotKey, index) => {
    acc[plotKey.key] = {
      label: plotKey.key,
      color: chartColors[index % chartColors.length],
    }
    return acc
  }, {} as ChartConfig)

  if (tooltipIndicator?.label) {
    chartConfig[tooltipIndicator.label] = {
      label: `${tooltipIndicator.label}${tooltipIndicator.unit ? ` (${tooltipIndicator.unit})` : ''}`,
      color: 'hsl(var(--chart-1))',
    }
  }

  const isFullWidth =
    dimensions?.mobile_width === 'col-span-full' &&
    dimensions?.tablet_width === 'md:col-span-full' &&
    dimensions?.laptop_width === 'lg:col-span-full' &&
    dimensions?.desktop_width === 'xl:col-span-full'

  return (
    <ChartContainer
      config={chartConfig}
      className={cn('transition-all', isFullWidth ? 'h-[300px] w-full' : '')}
    >
      <ResponsiveContainer
        width='100%'
        height={200}
      >
        <AreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={dataKey}
            tickLine
            axisLine
            tickMargin={8}
            label={{
              value: xAxisLabel,
              position: 'insideBottom',
              offset: -10,
              style: { fill: 'var(--tw-prose-body)' },
            }}
          />
          <YAxis
            tickFormatter={(value) => (formatNumber(value as number) ?? '').toString()}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              offset: 55,
              style: { fill: 'var(--tw-prose-body)' },
            }}
          />
          {tooltipIndicator?.show_label && (
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelKey={tooltipIndicator.label}
                  indicator='dot'
                />
              }
            />
          )}
          {keysToPlot.map((plotKey, index) => (
            <Area
              key={plotKey.key}
              dataKey={plotKey.key}
              type='natural'
              fill={chartColors[index % chartColors.length]}
              fillOpacity={0.4}
              stroke={chartColors[index % chartColors.length]}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
