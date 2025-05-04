import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'

interface Props {
  chartData: Record<string, string | number | null>[]
  dataFieldName: string
  dataKey: string
  color: string
  title?: string
  xLabel?: string
  yLabel?: string
}

const renderCustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const value = payload[payload.length - 1]?.value
    return (
      <div className='rounded-xl border-3 bg-white p-4 shadow-lg'>
        <div className='small-2stop mb-2 font-bold'>{label}</div>
        <div>
          <span className='small-2stop'>
            {payload[payload.length - 1]?.dataKey}:{' '}
            <span className='small-2stop font-bold'>{formatNumber(value)}</span>
          </span>
        </div>
      </div>
    )
  }
  return null
}

export default function SimpleLineChart({
  chartData,
  dataKey,
  dataFieldName,
  color,
  title,
  xLabel,
  yLabel,
}: Readonly<Props>) {
  return (
    <div className='flex h-full w-full flex-col'>
      {title && <div className='mb-2 text-center font-semibold'>{title}</div>}
      <ResponsiveContainer
        width='100%'
        height={300}
      >
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid
            strokeDasharray='3 3'
            opacity={0.2}
          />
          <XAxis
            dataKey={dataKey}
            tick={{ fontSize: 12 }}
            label={{
              value: xLabel || '',
              position: 'insideBottomRight',
              offset: -10,
              fill: '#666',
            }}
          />

          <YAxis
            tickFormatter={(value) => formatNumber(value as number) ?? ''}
            tick={{ fontSize: 12 }}
            label={{
              value: yLabel || '',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle' },
              fill: '#666',
            }}
          />
          <Tooltip content={renderCustomTooltip} />
          <Line
            type='monotone'
            dataKey={dataFieldName}
            stroke={color}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
