import useFetchRecord from '@/hooks/useFetchRecord'
import { CustomBarChart } from '@/Components/Charts/SampleChart/CustomBarChart'

interface OverviewProps {
  block: any
  selectedMonth: Date
}

export default function Overview({ block, selectedMonth }: Readonly<OverviewProps>) {
  console.log(selectedMonth)
  const month = (selectedMonth.getMonth() + 1).toString().padStart(2, '0')
  const year = selectedMonth.getFullYear()
  const formattedMonth = `${month}${year}`
  const [data, loading] = useFetchRecord<{
    data: Record<string, number | string>[]
  }>(
    `/subset/${block?.subset_id}?latest=${formattedMonth}&fields=${block?.dimension},${block?.measure}`
  )
  console.log(data)
  return (
    <div>
      {block?.chart_type == 'bar' && (
        <div>
          <CustomBarChart
            data={data?.data as Record<string, number | string>[]}
            dataKey={block.dimension}
            keysToPlot={[
              {
                key: block.measure,
                label: 'test',
                unit: 'tt',
              },
            ]}
            colors={block?.color_palette}
            fontSize={'text-sm'}
          />
        </div>
      )}
      {block?.chart_type == 'line' && 'LineChart'}
      {block?.chart_type == 'pie' && 'PieChart'}
    </div>
  )
}
