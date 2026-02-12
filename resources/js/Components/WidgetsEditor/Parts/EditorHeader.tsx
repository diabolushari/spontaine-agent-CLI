import React from 'react'
import BreadCrumbs from '@/Components/BreadCrumbs'

interface EditorHeaderProps {
    breadcrumbItems: { item: string; link: string }[]
}

export default function EditorHeader({ breadcrumbItems }: EditorHeaderProps) {
    return (
        <div className='mb-8'>
            <h1 className='text-2xl font-bold text-gray-900'>Widget Editor</h1>
            <div className=''>
                <BreadCrumbs breadcrumbItems={breadcrumbItems} />
            </div>
        </div>
    )
}
