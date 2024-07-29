import { ReactNode } from 'react'
import { cn } from '@/utils'

interface Props {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: Props) {
  return <div className={cn('bg-white rounded shadow w-full', className)}>{children}</div>
}
