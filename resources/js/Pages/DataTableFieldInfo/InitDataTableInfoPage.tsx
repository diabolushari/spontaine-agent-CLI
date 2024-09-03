import { DataDetail } from '@/interfaces/data_interfaces'
import { MetaStructure } from '@/interfaces/meta_interfaces'
import AddDataTableFields from '@/Components/DataDetail/DataTableFieldInfo/AddDataTableFields'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'

interface Props {
  detail: DataDetail
  structures: Pick<MetaStructure, 'id' | 'structure_name'>[]
}

export default function InitDataTableInfoPage({ detail, structures }: Readonly<Props>) {
  return (
    <AuthenticatedLayout>
      <DashboardPadding>
        <AddDataTableFields
          detail={detail}
          structures={structures}
        />
      </DashboardPadding>
    </AuthenticatedLayout>
  )
}
