import { Block } from '@/interfaces/data_interfaces'
import React, { useState } from 'react'
import { SampleChart } from './SampleChart'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import Button from '@/ui/button/Button'
import { router } from '@inertiajs/react'
import BlockEditModal from './BlockEditModal'

interface BlockActionProps {
  block: Block
}
interface BlockComponentProps {
  dimensions?: Record<string, string>
}
const blockComponents: Record<string, React.FC<BlockComponentProps>> = {
  'Active connection': SampleChart,
  'New connection': SampleChart,
  Old: SampleChart,
  New: SampleChart,
}

export const BlockAction = ({ block }: BlockActionProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const Component = blockComponents[block.name]
  const handleDelete = () => {
    if (confirm('Are you sure?')) {
      router.delete(route('blocks.destroy', block.id))
    }
  }
  const handleEditClick = () => {
    setEditModalOpen(true)
  }
  return (
    <div className=''>
      <Card>
        <div className='flex justify-between'>
          <div>
            <CardHeader
              title={block.name}
              subheading={`Block position ${block.position}`}
              onEditClick={handleEditClick}
              onDeleteClick={handleDelete}
            />
          </div>
          <div className='flex flex-row gap-2'>
            <Button
              type='button'
              label='Up'
            />
            <Button
              type='button'
              label='Down'
            />
          </div>
        </div>

        <div className='bg-black'>
          {Component ? <Component dimensions={block.dimensions} /> : <p>Unknown block type</p>}
        </div>
      </Card>
      {isEditModalOpen && (
        <BlockEditModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          block={block}
        />
      )}
    </div>
  )
}
