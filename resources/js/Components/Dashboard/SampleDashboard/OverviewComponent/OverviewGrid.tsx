import React, { useMemo } from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'
import Skeleton from 'react-loading-skeleton'
import { dateToYearMonth, formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'


import type { OverviewTable, Filter } from '@/interfaces/data_interfaces'

interface OverviewGridProps {
  readonly config: OverviewTable
  readonly selected: string | null
  readonly onSelect: (value: string) => void
  readonly selectedMonth: Date | null
  readonly onDelete?: (id: number) => void
}

const getMonthYear = (selectedMonth: Date | null): string => {
  return dateToYearMonth(selectedMonth)
}

const getFilterQuery = (filters?: Filter[]): string => {
  if (!filters || filters.length === 0) return ''
  const params = new URLSearchParams()
  filters.forEach((filter: Filter) => {
    params.append(filter.dimension, String(filter.value))
  })
  return `&${params.toString()}`
}

const getCellData = (
  graphValues: any,
  title: string,
  measureFields: string[]
): { title: string; value: string } => {
  if (!graphValues?.data || graphValues.data.length === 0 || !Array.isArray(measureFields) || measureFields.length === 0) {
    return { title, value: 'N/A' }
  }
  const measureKey = measureFields[0]
  const value = graphValues.data[0]?.[measureKey]
  return { title, value: value !== undefined && value !== null ? formatNumber(value) : 'N/A' }
}

const OverviewGrid: React.FC<OverviewGridProps> = ({
  config,
  selected,
  onSelect,
  selectedMonth,
  onDelete
}) => {
  const { subset_id, measure_field, title, filters } = config

  const monthYear = useMemo(() => getMonthYear(selectedMonth), [selectedMonth])

  const filterQuery = useMemo(() => getFilterQuery(filters), [filters])

  const [graphValues, loading] = useFetchRecord(
    `/subset/${subset_id ?? ''}?${selectedMonth == null ? 'latest=month' : `month=${monthYear}`}${filterQuery}`
  )

  const cellData = useMemo(() => getCellData(graphValues, title, measure_field), [graphValues, title, measure_field])

  if (loading) {
    return (
      <div className='rounded-lg border bg-white p-4 shadow'>
        <Skeleton height={60} />
      </div>
    )
  }

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={() => {
        onDelete?.(config.id)
      }}
      className={`relative cursor-pointer rounded-lg border bg-white p-4 text-center shadow outline-none transition hover:shadow-lg`}
    >
      <p className='text-sm uppercase text-gray-600'>{cellData.title}</p>
      <p className='text-xl font-bold'>{cellData.value}</p>
    </div>
  )
}
export default OverviewGrid
