import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts'

interface Props {
  chartData: Record<string, string | number | null>[]
  dataFieldName: string
  dataKey: string
  color: string
  title?: string
}

const renderCustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0]
    return (
      <div className='rounded-xl border-3 bg-white p-4 shadow-lg'>
        <div className='small-2stop mb-2 font-bold'>{name}</div>
        <div>
          <span className='small-2stop'>
            Value: <span className='small-2stop font-bold'>{value}</span>
          </span>
        </div>
      </div>
    )
  }
  return null
}

export default function SimplePieChart({
  chartData,
  dataKey,
  dataFieldName,
  color,
  title,
}: Readonly<Props>) {
  return (
    <div className='flex h-full w-full flex-col'>
      {title && <div className='mb-2 text-center font-semibold'>{title}</div>}
      <ResponsiveContainer
        width='100%'
        height={300}
      >
        <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <Pie
            data={chartData}
            dataKey={dataFieldName}
            nameKey={dataKey}
            cx='50%'
            cy='50%'
            outerRadius={100}
            fill={color}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={`${color}${90 - idx * 8}`}
              />
            ))}
          </Pie>
          <Tooltip content={renderCustomTooltip} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
