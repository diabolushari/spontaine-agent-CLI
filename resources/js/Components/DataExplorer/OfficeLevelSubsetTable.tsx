import { DataTableItem } from '@/interfaces/data_interfaces'
import { OfficeData, SelectedOfficeContext } from '@/Pages/DataExplorer/DataExplorer'
import { TableColName } from '@/Components/DataExplorer/DataSetTable'
import React, { useContext, useMemo } from 'react'
import Table from '@/ui/Table/Table'

interface Props {
  tableData?: DataTableItem[]
  officeLevel: string
  prevLevel?: OfficeData | null
  selectedOffice?: OfficeData | null
  tableCols: TableColName[]
}

export default function OfficeLevelSubsetTable({
  tableData,
  officeLevel,
  prevLevel,
  selectedOffice,
  tableCols,
}: Readonly<Props>) {
  const { setRegion, setCircle, setDivision, setSubdivision } = useContext(SelectedOfficeContext)

  const selectOffice = (row: DataTableItem) => {
    if (officeLevel === 'state' || row['office_code' as keyof typeof row] == null) {
      return
    }
    const office = {
      office_name:
        (row['office_name' as keyof typeof row] as string) ??
        (row['office_code' as keyof typeof row] as string),
      office_code: row['office_code' as keyof typeof row] as string,
    }
    if (officeLevel === 'region') {
      setRegion?.(office)
      setCircle?.(null)
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (officeLevel === 'circle') {
      setCircle?.(office)
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (officeLevel === 'division') {
      setDivision?.(office)
      setSubdivision?.(null)
    }
    if (officeLevel === 'subdivision') {
      setSubdivision?.(office)
    }
  }

  const colHeads = useMemo(() => {
    return tableCols.map((col) => col.name)
  }, [tableCols])

  const removeOffice = () => {
    if (officeLevel === 'region') {
      setRegion?.(null)
      setCircle?.(null)
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (officeLevel === 'circle') {
      setCircle?.(null)
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (officeLevel === 'division') {
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (officeLevel === 'subdivision') {
      setSubdivision?.(null)
    }
  }

  const { prevLevelName, currentLevelName } = useMemo(() => {
    switch (officeLevel) {
      case 'region':
        return {
          prevLevelName: 'state',
          currentLevelName: 'region',
        }
      case 'circle':
        return {
          prevLevelName: 'region',
          currentLevelName: 'circle',
        }
      case 'division':
        return {
          prevLevelName: 'circle',
          currentLevelName: 'division',
        }
      case 'subdivision':
        return {
          prevLevelName: 'circle',
          currentLevelName: 'subdivision',
        }
      case 'section':
        return {
          prevLevelName: 'subdivision',
          currentLevelName: 'section',
        }
      default:
        return {
          prevLevelName: '',
          currentLevelName: '',
        }
    }
  }, [officeLevel])

  return (
    <>
      <div className='flex flex-col gap-2'>
        {prevLevel != null && (
          <div className='my-5 flex flex-col gap-2'>
            <span>
              Showing {currentLevelName}s under{' '}
              <b>
                {prevLevel.office_name} ({prevLevel.office_code})
              </b>
            </span>
            <span className='text-xs'>
              You can select {prevLevelName} under {prevLevelName}s Tab.
            </span>
          </div>
        )}
      </div>
      {selectedOffice != null && (
        <div className='flex'>
          <div className='flex items-center justify-between gap-5 border-2 border-blue-500 p-2'>
            <span>
              {selectedOffice?.office_name} ({selectedOffice?.office_code})
            </span>
            <button
              className=''
              onClick={removeOffice}
            >
              <i className='la la-close' />
            </button>
          </div>
        </div>
      )}
      <Table
        heads={colHeads}
        className='h-[70vh]'
        editColumn
      >
        <tbody>
          {tableData?.map((item, index) => {
            return (
              <tr
                key={index}
                className={`standard-tr ${
                  selectedOffice != null &&
                  selectedOffice.office_code === item['office_code' as keyof typeof item]
                    ? 'bg-green-200'
                    : ''
                } ${officeLevel != 'state' ? 'cursor-pointer hover:bg-gray-100' : ''} `}
                onClick={() => selectOffice(item)}
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
                <td className='standard-td'></td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </>
  )
}
