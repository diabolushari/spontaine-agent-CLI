import React from 'react'
import { router } from '@inertiajs/react'
import ButtonBorderIcon from './ButtonBorderIcon'
import { Trash } from 'lucide-react'

interface Props {
  link?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown
}

export default function DeleteButton({ link, onClick }: Props) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (link != null) {
      router.get(link)
      return
    }
    if (onClick != null) {
      onClick(event)
    }
  }

  return (
    <ButtonBorderIcon onClick={handleClick}>
      <Trash className='h-6 w-6' />
    </ButtonBorderIcon>
  )
}
