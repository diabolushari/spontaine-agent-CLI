import { DataTableItem, SubsetDetail, SubsetMeasureField } from '@/interfaces/data_interfaces'
import React, { useEffect, useMemo, useState } from 'react'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import SelectList from '@/ui/form/SelectList'
import useFetchRecord from '@/hooks/useFetchRecord'
import { Paginator } from '@/ui/ui_interfaces'
import { TableColName } from '@/Components/DataExplorer/DataSetTable'
import Table from '@/ui/Table/Table'
import RestPagination from '@/ui/Pagination/RestPagination'

interface Props {
  subset: SubsetDetail
  officeLevel: string
}

const listTypes: { name: string }[] = [
  { name: 'Top 3' },
  { name: 'Top 5' },
  { name: 'Top 10' },
  { name: 'Top 20' },
  { name: 'Bottom 10' },
]

export default function OfficeRanking({ subset, officeLevel }: Readonly<Props>) {
  const [page, setPage] = useState(1)
  const [selectedListType, setSelectedListType] = useState('Top 10')

  useEffect(() => {
    setPage(1)
  }, [officeLevel, subset])

  const sortData = useMemo(() => {
    const [sortOrder, limit] = selectedListType.split(' ')

    return { sortOrder: sortOrder === 'Top' ? 'DESC' : 'ASC', limit: limit }
  }, [selectedListType])

  const measureFields = useMemo(() => {
    return subset.measures as SubsetMeasureField[]
  }, [subset])

  const [selectedSortField, setSelectedSortField] = useState(
    measureFields.length > 0 ? measureFields[0].subset_column : ''
  )

  useEffect(() => {
    if (measureFields.length > 0) {
      setSelectedSortField(measureFields[0].subset_column)
    }
  }, [measureFields])

  const [graphValues, loading] = useFetchRecord<{ data: Paginator<DataTableItem> }>(
    `/subset-summary/${subset.id}?level=${officeLevel}&sort_by=${selectedSortField}&sort_order=${sortData.sortOrder}&limit=${sortData.limit}&page=${page}&per_page=10`
  )

  const tableCols = useMemo(() => {
    const cols: TableColName[] = []

    if (officeLevel != 'state') {
      cols.push({
        name: 'Office Code',
        source: 'office_code',
        type: 'string',
      })

      cols.push({
        name: 'Office Name',
        source: 'office_name',
        type: 'string',
      })
    }

    subset.measures
      ?.filter((measure) => measure.subset_column == selectedSortField)
      .forEach((measure) => {
        if (measure.info == null) {
          return
        }
        const fieldName =
          measure.info.unit_field_name != null && measure.info.unit_column == null
            ? `${measure.subset_field_name} (${measure.info.unit_field_name})`
            : measure.subset_field_name

        cols.push({
          name: fieldName ?? '',
          source: measure.subset_column ?? '',
          type: 'number',
        })
        if (measure.info.unit_column != null) {
          cols.push({
            name: measure.info.unit_field_name ?? '',
            source: measure.info.unit_column ?? '',
            type: 'string',
          })
        }
      })

    return cols
  }, [subset, officeLevel, selectedSortField])

  const colHeads = useMemo(() => {
    return tableCols.map((col) => col.name)
  }, [tableCols])

  return (
    <FullSpinnerWrapper processing={loading}>
      <div className='mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4'>
        <div className='flex flex-col'>
          <SelectList
            list={listTypes}
            dataKey='name'
            displayKey='name'
            setValue={setSelectedListType}
            value={selectedListType}
          />
        </div>
        <div className='flex flex-col'>
          <SelectList
            list={measureFields}
            dataKey='subset_column'
            displayKey='subset_field_name'
            setValue={setSelectedSortField}
            value={selectedSortField}
          />
        </div>
      </div>
      <Table
        heads={colHeads}
        className='h-[70vh]'
        editColumn
      >
        <tbody>
          {graphValues?.data.data.map((item, index) => {
            return (
              <tr
                key={index}
                className={`standard-tr`}
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
      <div className='flex w-full flex-col'>
        {graphValues?.data != null && (
          <RestPagination
            pagination={graphValues.data}
            onNewPage={setPage}
          />
        )}
      </div>
    </FullSpinnerWrapper>
  )
}
