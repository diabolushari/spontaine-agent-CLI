import React, { useState } from 'react'
import NormalText from '@/typography/NormalText'
import OverviewChart from './OverviewComponent/OverviewChart'
import OverviewGrid from './OverviewComponent/OverviewGrid'
import AddGridItemModal from './OverviewComponent/AddGridItemModal' // Import the new modal

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
  const overview_table = content?.overview_table
  const overview_chart = content?.overview_chart

  const [isModalOpen, setIsModalOpen] = useState(false)

  function handleOpenModal() {
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setIsModalOpen(false)
  }

  function handleAddNewItem(newItemConfig: any) {
    console.log('A new item was configured and saved!', newItemConfig)
    // TODO: Add logic here to update the state that feeds the `OverviewGrid`.
    // For example, you might update the `overview_table` prop in the parent component.
  }

  return (
    <>
      <div className={`flex w-full flex-col pr-4 transition-all duration-300`}>
        <div className='mt-4 flex w-full justify-start p-2'>
          <span className='subheader-sm-1stop'>{content?.title}</span>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <div
            className={`${content?.overview?.card_type === 'chart_and_table' ? 'col-span-1' : 'col-span-2'} rounded-md border border-gray-200`}
          >
            {content?.overview?.card_type === 'chart_and_table' ||
              (content?.overview?.card_type === 'table' && (
                <OverviewGrid
                  config={overview_table}
                  onAdd={handleOpenModal}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                />
              ))}
          </div>
          <div
            className={`${content?.overview?.card_type === 'chart_and_table' ? 'col-span-1' : 'col-span-2'} rounded-md border border-gray-200`}
          >
            {content?.overview?.card_type === 'chart_and_table' ||
              (content?.overview?.card_type === 'chart' && (
                <OverviewChart
                  chart_content={overview_chart}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                />
              ))}
          </div>
        </div>
      </div>

      {/* The new modal is now cleanly integrated */}
      <AddGridItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddNewItem}
        subsetGroupId={subsetGroupId}
      />
    </>
  )
}
