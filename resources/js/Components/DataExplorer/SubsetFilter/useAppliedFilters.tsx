import { useEffect, useState } from 'react'
import {
  SubsetDateField,
  SubsetDimensionField,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'
import {
  dateOperations,
  dimensionOperations,
  measureOperations,
} from '@/Components/DataExplorer/SubsetFilter/subsetFilterOperations'

export default function useAppliedFilters(
  dates: SubsetDateField[],
  dimensions: SubsetDimensionField[],
  measures: SubsetMeasureField[],
  filters: Record<string, string>
) {
  const [appliedFilters, setAppliedFilters] = useState<
    {
      id: number
      filter: string
      filterKey: string
      filterValue: string
    }[]
  >([])

  useEffect(() => {
    const newFilters: {
      id: number
      filter: string
      filterKey: string
      filterValue: string
    }[] = []

    let uuidCounter = 1

    dates.forEach((date) => {
      dateOperations.forEach((dateOperation) => {
        const filter = `${date.subset_column}${dateOperation.value == '=' ? '' : dateOperation.value}`
        if (filters[filter] != null) {
          newFilters.push({
            id: uuidCounter++,
            filter: `${date.subset_field_name} ${dateOperation.operation} ${filters[filter]}`,
            filterKey: filter,
            filterValue: filters[filter],
          })
        }
      })
    })

    dimensions.forEach((dimension) => {
      dimensionOperations.forEach((dimensionOperation) => {
        const filter = `${dimension.subset_column}${dimensionOperation.value == '=' ? '' : dimensionOperation.value}`
        if (filters[filter] != null) {
          newFilters.push({
            id: uuidCounter++,
            filter: `${dimension.subset_field_name} ${dimensionOperation.operation} ${filters[filter]}`,
            filterKey: filter,
            filterValue: filters[filter],
          })
        }
      })
    })

    measures.forEach((measure) => {
      measureOperations.forEach((measureOperation) => {
        const filter = `${measure.subset_column}${measureOperation.value == '=' ? '' : measureOperation.value}`
        if (filters[filter] != null) {
          newFilters.push({
            id: uuidCounter++,
            filter: `${measure.subset_field_name} ${measureOperation.operation} ${filters[filter]}`,
            filterKey: filter,
            filterValue: filters[filter],
          })
        }
      })
    })

    if (filters['office_code'] != null) {
      newFilters.push({
        id: uuidCounter++,
        filter: `Office Code ${filters['office_code']}`,
        filterKey: 'office_code',
        filterValue: filters['office_code'],
      })
    }

    setAppliedFilters(newFilters)
  }, [dates, dimensions, measures, filters])

  return { appliedFilters }
}
