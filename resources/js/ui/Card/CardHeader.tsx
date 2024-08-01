import BackButton from '@/ui/button/BackButton'
import Heading from '@/typograpy/Heading'
import React from 'react'
import AddButton from '@/ui/button/AddButton'
import EditButton from '@/ui/button/EditButton'
import DeleteButton from '@/ui/button/DeleteButton'

interface Props {
  title: string
  backUrl?: string
  addUrl?: string
  editUrl?: string
  deleteUrl?: string
  onAddClick?: () => unknown
  onBackClick?: () => unknown
  onEditClick?: () => unknown
  onDeleteClick?: () => unknown
}

export default function CardHeader({
  title,
  backUrl,
  addUrl,
  onAddClick,
  onBackClick,
  editUrl,
  onEditClick,
  deleteUrl,
  onDeleteClick,
}: Props) {
  return (
    <div className='flex gap-5 flex-wrap bg-gray-200 py-4 px-4 justify-between items-center'>
      <div className='flex gap-5 items-center'>
        {(backUrl != null || onBackClick != null) && (
          <BackButton
            link={backUrl}
            onClick={onBackClick}
          />
        )}
        <Heading>{title}</Heading>
      </div>
      <div className='flex gap-2 flex-wrap'>
        {(editUrl != null || onEditClick != null) && (
          <EditButton
            link={editUrl}
            onClick={onEditClick}
          />
        )}
        {(deleteUrl != null || onDeleteClick != null) && (
          <DeleteButton
            link={deleteUrl}
            onClick={onDeleteClick}
          />
        )}
        {(addUrl != null || onAddClick != null) && (
          <AddButton
            link={addUrl}
            onClick={onAddClick}
          />
        )}
      </div>
    </div>
  )
}
