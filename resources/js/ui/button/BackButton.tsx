import { router } from '@inertiajs/react'
import ButtonBorderIcon from './ButtonBorderIcon'
import { ArrowLeftIcon } from 'lucide-react'

interface Properties {
  link?: string
  onClick?: () => unknown
}

export default function BackButton({ onClick, link }: Properties) {
  const handleClick = () => {
    if (link != null) {
      router.get(link)
      return
    }
    if (onClick != null) {
      onClick()
    }
  }

  return (
    <ButtonBorderIcon
      onClick={handleClick}
      type='danger'
    >
      <ArrowLeftIcon className='h-6 w-6' />
    </ButtonBorderIcon>
  )
}
