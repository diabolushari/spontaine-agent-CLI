import { DataDetail, DataTableItem } from '@/interfaces/data_interfaces'
import { useMemo } from 'react'
import Table from '@/ui/Table/Table'

interface Props {
  dataDetail: DataDetail
  dataTableItems: DataTableItem[]
}

export interface TableColName {
  name: string
  source: string
  type: string
}

export default function DataSetTable({ dataDetail, dataTableItems }: Readonly<Props>) {
  const tableCols = useMemo(() => {
    const cols: TableColName[] = []

    dataDetail.date_fields?.forEach((date) => {
      cols.push({ name: date.field_name ?? '', source: date.column ?? '', type: 'date' })
    })

    dataDetail.dimension_fields?.forEach((dimension) => {
      cols.push({
        name: dimension.field_name ?? '',
        source: `${dimension.column}`,
        type: 'string',
      })
    })

    dataDetail.measure_fields?.forEach((measure) => {
      const fieldName =
        measure.unit_field_name != null && measure.unit_column == null
          ? `${measure.field_name} (${measure.unit_field_name})`
          : measure.field_name
      cols.push({
        name: fieldName ?? '',
        source: measure.column ?? '',
        type: 'number',
      })
      if (measure.unit_column != null) {
        cols.push({
          name: measure.unit_field_name ?? '',
          source: measure.unit_column ?? '',
          type: 'string',
        })
      }
    })

    return cols
  }, [dataDetail])

  const colHeads = useMemo(() => {
    return tableCols.map((col) => col.name)
  }, [tableCols])

  return (
    <Table
      heads={colHeads}
      className='h-[70vh]'
    >
      <tbody>
        {dataTableItems.map((item, index) => {
          return (
            <tr
              key={index}
              className='standard-tr'
            >
              {tableCols.map((col, index) => {
                return (
                  <td
                    key={index}
                    className='standard-td'
                  >
                    {col.type === 'number'
                      ? (item[col.source as keyof DataTableItem] as number | null)?.toFixed(2)
                      : item[col.source as keyof DataTableItem]}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}
