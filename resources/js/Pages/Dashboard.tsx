import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { PageProps } from '@/types'
import { useState } from 'react'

export default function Dashboard({ auth }: PageProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <AuthenticatedLayout>
      <div className='py-12'>
        <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
          <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
            <div className='p-6 text-gray-900'></div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
