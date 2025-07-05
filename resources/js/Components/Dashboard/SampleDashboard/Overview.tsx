import React, { useState } from 'react'
import OverviewChart from './OverviewComponent/OverviewChart'
import OverviewGrid from './OverviewComponent/OverviewGrid'
import AddGridItemModal from './OverviewComponent/AddGridItemModal'

interface Props {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
  content: any
  subsetGroupId: number
}

export default function Overview({
  selectedMonth,
  setSelectedMonth,
  content,
  subsetGroupId,
}: Props) {
  // Destructure content for easier access and handle potential null/undefined content
  const { title, card_type, overview_chart, overview_table } = content || {}

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState<string>('')

  // Local state for demo grid items
  const [demoGridItems, setDemoGridItems] = useState<any[]>(() => {
    // If overview_table exists, initialize with it; else, empty array
    return overview_table ? [overview_table] : []
  })

  function handleOpenModal() {
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setIsModalOpen(false)
  }

  // Placeholder for adding a chart
  function handleOpenAddChartModal() {
    // TODO: Implement logic to open a chart configuration modal
    alert('Add Chart functionality not yet implemented.')
  }

  function handleAddNewItem(newItemConfig: any) {
    setDemoGridItems((prev) => [...prev, newItemConfig])
    setIsModalOpen(false)
  }

  // --- Placeholder for posting data to server ---
  // async function postGridItemsToServer(items: any[]) {
  //   try {
  //     await fetch('/api/overview-grid', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(items),
  //     })
  //   } catch (error) {
  //     console.error('Failed to post grid items', error)
  //   }
  // }

  // Determine which components to show based on card_type
  const showTable = card_type === 'chart_and_table' || card_type === 'table'
  const showChart = card_type === 'chart_and_table' || card_type === 'chart'

  function handleDeleteGridItem(id: number) {
    console.log('delete', id)
    setDemoGridItems(items => items.filter(item => item.id !== id))
  }

  return (
    <>
      <div className='flex min-h-56 w-full flex-col pr-4 transition-all duration-300'>
        <div className='mt-4 flex w-full justify-start p-2'>
          <span className='subheader-sm-1stop'>{title}</span>
        </div>

        <div
          className={`grid ${card_type === 'chart_and_table' ? 'grid-cols-1 gap-4 md:grid-cols-2' : 'grid-cols-1'}`}
        >
          {/* --- Table / Grid Section --- */}
          {showTable && (
            <div className='grid grid-cols-2 gap-4'>
              {demoGridItems.slice(0, 6).map((item, idx) => (
                <div
                  key={idx}
                  className={item.col_span_2 ? 'col-span-2' : ''}
                >
                  <OverviewGrid
                    config={item}
                    selected={selected}
                    onSelect={setSelected}
                    selectedMonth={selectedMonth}
                    onDelete={handleDeleteGridItem}
                  />
                </div>
              ))}
              {demoGridItems.length < 6 && (
                <button
                  onClick={handleOpenModal}
                  className='flex min-h-[60px] h-full w-full items-center justify-center rounded-lg border bg-white p-4 text-center shadow outline-none transition hover:shadow-lg border-dashed border-2 border-gray-300 text-indigo-600 hover:border-indigo-500 hover:text-indigo-800'
                  style={{ fontSize: '1.25rem', fontWeight: 600 }}
                >
                  + Add Cell
                </button>
              )}
            </div>
          )}

          {/* --- Chart Section --- */}
          {showChart && (
            <div className='flex-1 rounded-md border border-gray-200'>
              {overview_chart ? (
                <OverviewChart
                  chart_content={overview_chart}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                />
              ) : (
                // Placeholder for adding a chart
                <div className='flex h-full min-h-[200px] w-full items-center justify-center rounded-md border-dashed border-gray-300 bg-gray-50'>
                  <button
                    onClick={handleOpenAddChartModal}
                    className='rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  >
                    Add Chart
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* The same modal is used for adding the first item or subsequent items */}
      <AddGridItemModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSave={handleAddNewItem}
        subsetGroupId={subsetGroupId}
      />
    </>
  )
}
