import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'

export default function DataDetailShow() {
  return (
    <AuthenticatedLayout>
      <DashboardPadding>
        <Card>
          <CardHeader title='Data Detail' />
        </Card>
      </DashboardPadding>
    </AuthenticatedLayout>
  )
}
