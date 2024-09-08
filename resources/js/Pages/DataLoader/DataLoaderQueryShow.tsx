import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { useMemo, useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { DataLoaderQuery } from '@/interfaces/data_interfaces'

interface Props {
  dataLoaderQuery: DataLoaderQuery
}

export default function MetaGroupShow({ dataLoaderQuery }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const displayedValues = useMemo(() => {
    return [
      {
        id: 1,
        label: 'Name',
        content: dataLoaderQuery.name,
        type: 'text',
      },
      {
        id: 2,
        label: 'Description',
        content: dataLoaderQuery.description,
        type: 'text',
      },
      {
        id: 3,
        label: 'Connection',
        content: dataLoaderQuery.connection?.name ?? '',
        type: 'text',
      },
      {
        id: 4,
        label: 'Query',
        content: dataLoaderQuery.query,
        type: 'text',
      },
    ] as ShowPageItem[]
  }, [])

  return (
    <ShowResourcePage
      title={''}
      items={displayedValues}
      backUrl={route('loader-queries.index')}
      editUrl={route('loader-queries.edit', dataLoaderQuery.id)}
      onDeleteClick={() => {
        setShowDeleteModal(true)
      }}
    >
      {/**more content**/}
      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete ${dataLoaderQuery.name}`}
          url={route('loader-queries.destroy', dataLoaderQuery.id)}
        >
          <p>Are you sure you want to delete record?</p>
        </DeleteModal>
      )}
    </ShowResourcePage>
  )
}
