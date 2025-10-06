import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import useCustomForm from '@/hooks/useCustomForm'
import Input from '@/ui/form/Input'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Overview from '@/Components/WidgetsEditor/Overview'
import WidgetLayout from '@/Components/WidgetsEditor/WidgetLayout'
import React from 'react'
import { chartPallet } from '@/Components/Charts/SampleChart/ColorPallets'

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

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'line', label: 'Line Chart' },
  ]
  const paletteOptions = [
    { value: 'boldWarm', label: 'Bold Warm' },
    { value: 'softNeutral', label: 'Soft Neutral' },
    { value: 'freshGreen', label: 'Fresh Green' },
    { value: 'fireSunset', label: 'Fire Sunset' },
    { value: 'blueGrey', label: 'Blue Grey' },
    { value: 'citrusMint', label: 'Citrus Mint' },
    { value: 'earthGreen', label: 'Earth Green' },
    { value: 'duskContrast', label: 'Dusk Contrast' },
  ]

  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* LEFT – Form */}
          <div className='lg:col-span-1'>
            <form className='space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
              <div>
                <h2 className='mb-1 text-lg font-semibold text-slate-800'>Widget settings</h2>
                <p className='text-sm text-slate-500'>
                  Configure the basic information for your widget.
                </p>
              </div>

              <div className='flex flex-col'>
                <Input
                  label='Widget title'
                  value={formData.title}
                  setValue={setFormValue('title')}
                />
              </div>

              <div className='flex flex-col'>
                <Input
                  label='Widget subtitle'
                  value={formData.subtitle}
                  setValue={setFormValue('subtitle')}
                />
              </div>

              <div>
                <DynamicSelectList
                  label='Data source'
                  url='/api/data-detail'
                  dataKey='id'
                  displayKey='name'
                  value={formData.data_table_id ?? 0}
                  setValue={setFormValue('data_table_id')}
                />
              </div>

              <div>
                <DynamicSelectList
                  label='Subset group'
                  url={`/api/data-detail/subset-group/${formData.data_table_id}`}
                  dataKey='id'
                  displayKey='name'
                  value={formData.subset_group_id ?? ''}
                  setValue={setFormValue('subset_group_id')}
                />
              </div>

              {/* Chart Type Selection */}
              <div className='flex flex-col'>
                <label className='mb-3 text-sm font-medium text-slate-700'>Chart type</label>
                <div className='space-y-3'>
                  {chartTypes.map((type) => (
                    <label
                      key={type.value}
                      className='group flex cursor-pointer items-center'
                      htmlFor={type.value}
                    >
                      <div className='relative flex items-center'>
                        <input
                          name='chart_type'
                          type='radio'
                          className='peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-slate-300 transition-all checked:border-blue-600'
                          id={type.value}
                          value={type.value}
                          checked={formData.chart_type === type.value}
                          onChange={(e) => setFormValue('chart_type')(e.target.value)}
                        />
                        <span className='pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-600 opacity-0 transition-opacity duration-200 peer-checked:opacity-100'></span>
                      </div>
                      <span className='ml-3 text-sm text-slate-600 group-hover:text-slate-800'>
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className='col-span-3 flex flex-col'>
                <DynamicSelectList
                  label='Subset'
                  url={`/api/subset-group/${formData?.subset_group_id}`}
                  dataKey='subset_detail_id'
                  displayKey='name'
                  value={formData.subset_id}
                  setValue={setFormValue('subset_id')}
                />
              </div>

              <div>
                <DynamicSelectList
                  label='Measure'
                  url={`/api/subset/${formData.subset_id}`}
                  dataKey='subset_column'
                  displayKey='subset_field_name'
                  value={formData.measure ?? ''}
                  setValue={setFormValue('measure')}
                />
              </div>
              <div>
                <DynamicSelectList
                  label='Dimension'
                  url={`/api/subset/dimension/${formData.subset_id}`}
                  dataKey='subset_column'
                  displayKey='subset_field_name'
                  value={formData.dimension ?? ''}
                  setValue={setFormValue('dimension')}
                />
              </div>
              {/* Color Palette Selection */}
              <div className='flex flex-col'>
                <label className='mb-3 text-sm font-medium text-slate-700'>Color palette</label>
                <div className='space-y-3'>
                  {paletteOptions.map((palette) => (
                    <label
                      key={palette.value}
                      className='group flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-3 transition-all hover:border-blue-300 hover:bg-blue-50'
                      htmlFor={palette.value}
                    >
                      <div className='flex items-center'>
                        <div className='relative flex items-center'>
                          <input
                            name='color_palette'
                            type='radio'
                            className='peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-slate-300 transition-all checked:border-blue-600'
                            id={palette.value}
                            value={palette.value}
                            checked={formData.color_palette === palette.value}
                            onChange={(e) => setFormValue('color_palette')(e.target.value)}
                          />
                          <span className='pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-600 opacity-0 transition-opacity duration-200 peer-checked:opacity-100'></span>
                        </div>
                        <span className='ml-3 text-sm text-slate-600 group-hover:text-slate-800'>
                          {palette.label}
                        </span>
                      </div>
                      {/* Color Swatches Preview */}
                      <div className='flex gap-1'>
                        {chartPallet[palette.value as keyof typeof chartPallet]
                          .slice(0, 5)
                          .map((color, idx) => (
                            <div
                              key={idx}
                              className='h-5 w-5 rounded border border-slate-200 shadow-sm'
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT – Preview / Placeholder */}
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
