import {
  SubsetDateField,
  SubsetDimensionField,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'
import {
  SubsetFilterFormField,
  SubsetFilterFormType,
} from '@/Components/DataExplorer/SubsetFilter/SubsetFilterForm'
import {
  dateOperations,
  dimensionOperations,
  measureOperations,
} from '@/Components/DataExplorer/SubsetFilter/subsetFilterOperations'
import { OfficeData } from '@/Pages/DataExplorer/DataExplorerPage'

//TODO: initSubsetFilterFormFields should be moved to a separate file

function addFilterField(
  fields: SubsetFilterFormField[],
  options: {
    field: string
    operator: string
    value?: string | null
    type: SubsetFilterFormType
    officeData?: { office_name: string; office_code: string } | null
    dimensionData?: { value: string } | null
  }
) {
  fields.push({
    id: 0,
    field: options.field,
    operator: options.operator,
    value: options.value ?? '',
    officeData: options.officeData ?? null,
    dimensionData: options.dimensionData ?? null,
    type: options.type,
  })
}

function handleInNotIn(
  key: string,
  item: { subset_column: string | null },
  suffix: '_in' | '_not_in',
  operator: '==' | '_not',
  filters: Record<string, string | null | undefined>,
  fields: SubsetFilterFormField[],
  type: 'date' | 'string' | 'dimension',
  getDimensionData: (value: string) => { value: string } | null
) {
  if (key === `${item.subset_column}${suffix}`) {
    filters[key]?.split(',').forEach((value) => {
      fields.push({
        id: 0,
        field: item.subset_column ?? '',
        operator,
        value,
        officeData: null,
        dimensionData: getDimensionData(value),
        type,
      })
    })
  }
}

const generateInitialFields = (
  filters: Record<string, string | undefined | null>,
  dates: SubsetDateField[],
  measures: SubsetMeasureField[],
  dimensions: SubsetDimensionField[],
  offices?: OfficeData[],
  month?: boolean
) => {
  const fields: SubsetFilterFormField[] = []

  Object.keys(filters).forEach((key) => {
    dates.forEach((date) => {
      dateOperations.forEach((dateOperation) => {
        //*TOdo find opeatation,
        // TODO insert to datesList
        if (
          key === `${date.subset_column}${dateOperation.value == '=' ? '' : dateOperation.value}`
        ) {
          addFilterField(fields, {
            field: date.subset_column ?? '',
            operator: dateOperation.value,
            value: filters[key],
            type: date.use_expression === 1 ? 'string' : 'date',
          })
        }
      })
      handleInNotIn(
        key,
        date,
        '_in',
        '==',
        filters,
        fields,
        date.use_expression === 1 ? 'string' : 'date',
        () => null
      )
      handleInNotIn(
        key,
        date,
        '_not_in',
        '_not',
        filters,
        fields,
        date.use_expression === 1 ? 'string' : 'date',
        () => null
      )
    })
    dimensions.forEach((dimension) => {
      dimensionOperations.forEach((dimensionOperation) => {
        if (dimension.subset_column == 'month') {
          if (month) {
            addFilterField(fields, {
              field: 'month',
              operator: '=',
              value: filters[key],
              type: 'dimension',
              dimensionData: { value: filters[key] ?? '' },
            })
          }
          return
        }
        const columnName =
          dimension.subset_column === 'section_code' ? 'office_code' : dimension.subset_column
        if (
          key === `${columnName}${dimensionOperation.value == '=' ? '' : dimensionOperation.value}`
        ) {
          if (columnName === 'office_code') {
            const office = offices?.find((office) => office.office_code === filters[key])
            const officeName = (office?.office_name as string) ?? filters[key]
            const officeCode = (office?.office_code as string) ?? filters[key]
            addFilterField(fields, {
              field: columnName,
              operator: dimensionOperation.value,
              type: 'office',
              officeData: { office_name: officeName, office_code: officeCode },
            })
            return
          }
          addFilterField(fields, {
            field: dimension.subset_column ?? '',
            operator: dimensionOperation.value,
            type: 'dimension',
            dimensionData: { value: filters[key] ?? '' },
          })
        }
      })
      handleInNotIn(key, dimension, '_in', '==', filters, fields, 'dimension', (value) => ({
        value,
      }))
      handleInNotIn(key, dimension, '_not_in', '_not', filters, fields, 'dimension', (value) => ({
        value,
      }))
    })
    measures.forEach((measure) => {
      measureOperations.forEach((measureOperation) => {
        if (
          key ===
          `${measure.subset_column}${measureOperation.value == '=' ? '' : measureOperation.value}`
        ) {
          addFilterField(fields, {
            field: measure.subset_column ?? '',
            operator: measureOperation.value,
            value: filters[key],
            type: 'number',
          })
        }
      })
    })
  })

  return fields
}

export default generateInitialFields
