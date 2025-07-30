import { DataDetail } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import DataSetTable from '@/Components/DataExplorer/DataSetTable'
import DataTableExcelImport from '@/Components/DataDetail/DataTableExcelImport/DataTableExcelImport'
import DataDetailFilter from '@/Components/DataDetail/Filter/DataDetailFilter'
import Pagination from '@/ui/Pagination/Pagination'
import React from 'react'

interface DataDetailTableSectionProps {
  detail: DataDetail
  filters: Record<string, any>
  dataTableItems: Paginator<any>
  onSubmit: (filters: Record<string, any>) => void
}

export default function DataDetailTableSection({
  detail,
  filters,
  dataTableItems,
  onSubmit,
}: Readonly<DataDetailTableSectionProps>) {
  const handleFilterSubmit = (queryString: string | null) => {
    if (!queryString) {
      onSubmit({})
      return
    }

    const params = new URLSearchParams(queryString)
    const filters: Record<string, string> = {}

    params.forEach((value, key) => {
      filters[key] = value
    })

    onSubmit(filters)
  }
  return (
    <>
      <div className='mb-4'>
        <DataDetailFilter
          details={detail}
          filters={filters}
          onSubmit={handleFilterSubmit}
        />
      </div>
      <div className='my-5 flex items-center justify-end gap-5'>
        <a
          target='_blank'
          href={`/export-data-table/${detail.id}`}
          className='link'
          rel='noreferrer'
        >
          Export Data
        </a>
        <DataTableExcelImport dataDetail={detail} />
      </div>
      <div className='snap-y snap-mandatory'>
        <DataSetTable
          dataDetail={detail}
          dataTableItems={dataTableItems.data}
        />
      </div>
      <Pagination pagination={dataTableItems} />
    </>
  )
}
