import RankedList from '@/Components/Dashboard/SampleDashboard/RankedList'

interface RankingWidgetProps {
  subsetId: number
  subsetColumn: string | null
  subsetFieldName: string | null
  selectedMonth: Date
  level: string
}

export default function RankingWidget({
  subsetId,
  subsetColumn,
  subsetFieldName,
  selectedMonth,
  level,
}: Readonly<RankingWidgetProps>) {
  const month = (selectedMonth.getMonth() + 1).toString().padStart(2, '0')
  const year = selectedMonth.getFullYear()
  const formattedMonth = `${year}${month}`

  return (
    <>
      {subsetId == null && (
        <div className='flex h-full items-center justify-center'>
          <div className='text-gray-500'>No data</div>
        </div>
      )}
      {subsetColumn != null && subsetFieldName != null && subsetId != null && (
        <div>
          <RankedList
            subsetId={subsetId}
            dataField={subsetColumn}
            dataFieldName={subsetFieldName}
            rankingPageUrl={'#'}
            timePeriod={formattedMonth}
            timePeriodFieldName={'month'}
            level={level}
          />
        </div>
      )}
    </>
  )
}
