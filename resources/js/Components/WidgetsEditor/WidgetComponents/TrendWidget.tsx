import TrendGraph from '@/Components/WidgetsEditor/WidgetComponents/TrendGraph'

interface TrendWidgetProps {
  formData: {
    trend_subset_id: number
    trend_measure: {
      subset_column: string
      subset_field_name: string
    }[]
    trend_chart_type: string
    trend_color: string
  }
  selectedMonth: Date
  setSelectedMonth: (date: Date) => void
}

export default function TrendWidget({
  formData,
  selectedMonth,
  setSelectedMonth,
}: Readonly<TrendWidgetProps>) {
  if (!formData.trend_subset_id || !formData.trend_measure) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-gray-500'>No data</div>
      </div>
    )
  } else {
    return (
      <div>
        <TrendGraph
          subsetId={formData.trend_subset_id}
          dataField={formData.trend_measure[0].subset_column}
          dataFieldName={formData.trend_measure[0].subset_field_name}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          chartType={formData.trend_chart_type || 'area'}
          color={formData.trend_color}
        />
      </div>
    )
  }
}
