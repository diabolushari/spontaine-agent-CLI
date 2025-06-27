import React, { useMemo } from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'
import Skeleton from 'react-loading-skeleton'
import { dateToYearMonth, formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'

interface MeasureField {
  label: string
  value: string
  unit: string
  show_label: boolean
}

interface Config {
  title: string
  subset_id: string
  dimension_field: string
  grid_number: string
  measure_field: MeasureField[]
  show_total: boolean
  measure_field_dimension: string
  order?: 'ascending' | 'descending'
}

interface OverviewGridProps {
  config: Config
  toggleValue: boolean
  selected: string
  onSelect: (value: string) => void
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}

const OverviewGrid: React.FC<OverviewGridProps> = ({
  config,
  toggleValue,
  selected,
  onSelect,
  selectedMonth,
  setSelectedMonth,
}) => {
  const {
    dimension_field,
    subset_id,
    grid_number,
    measure_field,
    title,
    show_total,
    measure_field_dimension,
    order, // Destructure order from config
  } = config
  const monthYear = useMemo(() => {
    return dateToYearMonth(selectedMonth)
  }, [selectedMonth])
  // API URL to fetch dimension values
  const dimensionApiUrl = `/api/subset/dimension/fields/${dimension_field}/${subset_id}`
  const [dimensionResponse, dimensionLoading] = useFetchRecord<{ name: string }[]>(dimensionApiUrl)
  const dimensionValues = dimensionResponse ? dimensionResponse.map((d) => d.name) : []
  const [graphValues] = useFetchRecord(
    `/subset/${subset_id}?${selectedMonth == null ? 'latest=month' : `month=${monthYear}`}${
      measure_field_dimension ? `&${dimension_field}=${measure_field_dimension}` : ''
    }`
  )

  const sortedMeasureFields = useMemo(() => {
    const data = graphValues?.data?.[0]
    const fieldsToSort = [...measure_field]

    if (!order || !data) {
      return fieldsToSort
    }

    fieldsToSort.sort((a, b) => {
      const valA = data[a.value]
      const valB = data[b.value]
      const numA = typeof valA === 'number' ? valA : -Infinity
      const numB = typeof valB === 'number' ? valB : -Infinity

      return order === 'descending' ? numB - numA : numA - numB
    })
    return fieldsToSort
  }, [measure_field, graphValues, order])

  const dataMap = useMemo(() => {
    if (!graphValues?.data || !measure_field?.[0]?.value) {
      return new Map<string, number>()
    }
    const measureKey = measure_field[0].value
    const map = new Map<string, number>()
    graphValues.data.forEach((item: any) => {
      if (item[dimension_field] !== undefined) {
        map.set(item[dimension_field], item[measureKey])
      }
    })
    return map
  }, [graphValues, dimension_field, measure_field])

  const sortedDimensionValues = useMemo(() => {
    const valuesToSort = [...dimensionValues]
    if (!order) return valuesToSort

    valuesToSort.sort((a, b) => {
      const valA = dataMap.get(a) ?? -Infinity
      const valB = dataMap.get(b) ?? -Infinity

      return order === 'descending' ? valB - valA : valA - valB
    })
    return valuesToSort
  }, [dimensionValues, dataMap, order])

  const isMultiMeasure = measure_field?.length > 0
  const gridNumber = parseInt(grid_number || '', 10)
  const visibleCount =
    isNaN(gridNumber) || gridNumber <= 0
      ? isMultiMeasure
        ? measure_field.length
        : dimensionValues.length
      : gridNumber

  return (
    <div className='flex w-full flex-col gap-4 p-2'>
      <h2 className='text-xl font-semibold'>{title}</h2>

      {dimensionLoading ? (
        <Skeleton height={200} />
      ) : (
        <div className='grid grid-cols-2 gap-2'>
          {/* Total card on top */}
          {show_total && (
            <div className='col-span-2 rounded border bg-gray-100 p-4 text-center font-semibold text-gray-800'>
              TOTAL
            </div>
          )}

          {/* Dynamic logic: uses sorted arrays for rendering */}
          {measure_field_dimension
            ? sortedMeasureFields.slice(0, visibleCount).map((field) => (
                <div
                  key={field.value}
                  role='button'
                  tabIndex={0}
                  onClick={() => onSelect(field.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelect(field.value)
                    }
                  }}
                  className={`cursor-pointer rounded border p-4 text-center outline-none transition ${
                    selected === field.value ? 'border-blue-500 bg-blue-100' : 'hover:shadow'
                  }`}
                >
                  <p className='text-sm text-gray-600'>{field.label}</p>
                  <p>{formatNumber(graphValues?.data?.[0]?.[field.value] ?? 'N/A')}</p>
                </div>
              ))
            : sortedDimensionValues.slice(0, visibleCount).map((value) => (
                <div
                  key={value}
                  role='button'
                  tabIndex={0}
                  onClick={() => onSelect(value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelect(value)
                    }
                  }}
                  className={`cursor-pointer rounded border p-4 text-center outline-none transition ${
                    selected === value ? 'border-blue-500 bg-blue-100' : 'hover:shadow'
                  }`}
                >
                  <p className='text-lg font-bold'>{value}</p>
                  <p>
                    {dataMap.has(value) ? (
                      <span className='text-green-500'>{formatNumber(dataMap.get(value))}</span>
                    ) : (
                      <span className='text-red-500'>✗</span>
                    )}
                  </p>
                </div>
              ))}
        </div>
      )}
    </div>
  )
}
export default OverviewGrid
