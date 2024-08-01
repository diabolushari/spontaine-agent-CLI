import React from 'react'
import { router } from '@inertiajs/react'
import ButtonBorderIcon from './ButtonBorderIcon'
import { Pencil } from 'lucide-react'

interface Props {
  link?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown
}

export default function EditButton({ link, onClick }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (link != null) {
      router.get(link)
      return
    }
    if (onClick != null) {
      onClick(e)
    }
  }

  return (
    <ButtonBorderIcon onClick={handleClick}>
      <Pencil className='h-6 w-6' />
    </ButtonBorderIcon>
  )
}
