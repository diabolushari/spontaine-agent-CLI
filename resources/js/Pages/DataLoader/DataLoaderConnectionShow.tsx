import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { useMemo, useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { DataLoaderConnection } from '@/interfaces/data_interfaces'

interface Props {
  dataLoaderConnection: DataLoaderConnection
}

export default function MetaGroupShow({ dataLoaderConnection }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const displayedValues = useMemo(() => {
    return [
      {
        id: 1,
        label: 'Name',
        content: dataLoaderConnection.name,
        type: 'text',
      },
      {
        id: 2,
        label: 'Description',
        content: dataLoaderConnection.description,
        type: 'text',
      },
      {
        id: 3,
        label: 'Driver',
        content: dataLoaderConnection.driver,
        type: 'text',
      },
      {
        id: 4,
        label: 'Host',
        content: dataLoaderConnection.host,
        type: 'text',
      },
      {
        id: 5,
        label: 'Port',
        content: dataLoaderConnection.port,
        type: 'text',
      },
      {
        id: 6,
        label: 'Username',
        content: dataLoaderConnection.username,
        type: 'text',
      },
      {
        id: 8,
        label: 'Database',
        content: dataLoaderConnection.database,
        type: 'text',
      },
    ] as ShowPageItem[]
  }, [dataLoaderConnection])

  return (
    <ShowResourcePage
      title={''}
      items={displayedValues}
      backUrl={route('loader-connections.index')}
      editUrl={route('loader-connections.edit', dataLoaderConnection.id)}
      onDeleteClick={() => {
        setShowDeleteModal(true)
      }}
    >
      {/**more content**/}
      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete Connection ${dataLoaderConnection.name}`}
          url={route('loader-connections.destroy', dataLoaderConnection.id)}
        >
          <p>Are you sure you want to delete record?</p>
        </DeleteModal>
      )}
    </ShowResourcePage>
  )
}
