import RankedList from '@/Components/Dashboard/SampleDashboard/RankedList'

interface RankingWidgetProps {
  formData: {
    rank_subset_id: number
    rank_ranking_field: {
      subset_column: string
      subset_field_name: string
    }
  }
  selectedMonth: Date
}

export default function RankingWidget({ formData, selectedMonth }: Readonly<RankingWidgetProps>) {
  const month = (selectedMonth.getMonth() + 1).toString().padStart(2, '0')
  const year = selectedMonth.getFullYear()
  const formattedMonth = `${year}${month}`

  console.log('ranking data', formData.rank_ranking_field)

  return (
    <>
      {!formData.rank_subset_id && !formData.rank_ranking_field && (
        <div className='flex h-full items-center justify-center'>
          <div className='text-gray-500'>No data</div>
        </div>
      )}
      {formData.rank_ranking_field != null && formData.rank_subset_id && (
        <div>
          <RankedList
            subsetId={formData.rank_subset_id}
            dataField={formData.rank_ranking_field.subset_column}
            dataFieldName={formData.rank_ranking_field.subset_field_name}
            rankingPageUrl={'#'}
            timePeriod={formattedMonth}
            timePeriodFieldName={'month'}
          />
        </div>
      )}
    </>
  )
}
