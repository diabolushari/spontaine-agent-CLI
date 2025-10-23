import TrendGraph from '@/Components/WidgetsEditor/WidgetComponents/TrendGraph'
import { Dispatch, SetStateAction } from 'react'

interface TrendWidgetProps {
  formData: {
    trend_subset_id: number
    trend_measure: {
      subset_column: string
      subset_field_name: string
    }[]
    trend_chart_type?: 'area' | 'bar'
    trend_color: string
  }
  selectedMonth: Date | null
  setSelectedMonth: Dispatch<SetStateAction<Date | null>>
}

export default function TrendWidget({
  formData,
  selectedMonth,
  setSelectedMonth,
}: Readonly<TrendWidgetProps>) {
  return (
    <>
      {!formData.trend_subset_id && !formData.trend_measure && (
        <div className='flex h-full items-center justify-center'>
          <div className='text-gray-500'>No data</div>
        </div>
      )}
      {formData.trend_measure != null && formData.trend_subset_id && (
        <div>
          <TrendGraph
            subsetId={formData.trend_subset_id}
            dataField={formData.trend_measure[0].subset_column}
            dataFieldName={formData.trend_measure[0].subset_field_name}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            chartType={formData.trend_chart_type ?? 'area'}
          />
        </div>
      )}
    </>
  )
}
