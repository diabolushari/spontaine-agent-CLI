import { useState } from 'react'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import { Widget, WidgetCollection } from '@/interfaces/data_interfaces'
import WidgetListView from '@/Components/WidgetsEditor/WidgetListView'
import WidgetDetailView from '@/Components/WidgetsEditor/WidgetDetailView'

interface PaginatedData<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  next_page_url: string | null
  prev_page_url: string | null
  links: { url: string | null; label: string; active: boolean }[]
}

interface Props {
  collections: WidgetCollection[]
  widgets: PaginatedData<Widget>
}

export default function WidgetCollectionIndexPage({ collections, widgets }: Readonly<Props>) {
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null)

  return (
    <AnalyticsDashboardLayout>
      {selectedWidget ? (
        <WidgetDetailView
          widget={selectedWidget}
          onBack={() => setSelectedWidget(null)}
        />
      ) : (
        <WidgetListView
          collections={collections}
          widgets={widgets}
          onSelectWidget={setSelectedWidget}
        />
      )}
    </AnalyticsDashboardLayout>
  )
}
