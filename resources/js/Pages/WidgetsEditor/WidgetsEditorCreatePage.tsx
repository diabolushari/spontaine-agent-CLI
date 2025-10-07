import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import useCustomForm from '@/hooks/useCustomForm'
import Overview from '@/Components/WidgetsEditor/Overview'
import WidgetLayout from '@/Components/WidgetsEditor/WidgetLayout'
import WidgetSettingsForm from '@/Components/WidgetsEditor/ConfigSection/WidgetSettingsForm'
import React from 'react'

interface Props {
  widget?: any
}

export default function WidgetsEditorCreatePage({ widget }: Readonly<Props>) {
  const [selectedMonth, setSelectedMonth] = React.useState(new Date())
  const { formData, setFormValue } = useCustomForm({
    title: widget?.title ?? '',
    subtitle: widget?.subtitle ?? '',
    data_table_id: widget?.data_table_id ?? null,
    subset_group_id: widget?.subset_group_id ?? null,
    chart_type: widget?.chart_type ?? 'bar',
    subset_id: widget?.subset_id ?? null,
    measure: widget?.measure ?? null,
    dimension: widget?.dimension ?? null,
    color_palette: widget?.color_palette ?? 'boldWarm',
  })

  const handleSubmit = () => {
    console.log(formData)
  }

  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='lg:col-span-1'>
            <WidgetSettingsForm
              formData={formData}
              setFormValue={setFormValue}
            />
            <button onClick={() => handleSubmit()}>submit</button>
          </div>

          <div className='lg:col-span-2'>
            <WidgetLayout
              block={formData}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            >
              <Overview
                block={formData}
                selectedMonth={selectedMonth}
              />
            </WidgetLayout>
          </div>
        </div>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
