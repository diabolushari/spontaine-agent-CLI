import * as Accordion from '@radix-ui/react-accordion'
import { AccordionContent, AccordionTrigger } from '@/Components/WidgetsEditor/AccrodionDropdown'
import BasicSettingsSection from '@/Components/WidgetsEditor/ConfigSection/BasicSettingsSection'
import OverviewChartSection from '@/Components/WidgetsEditor/ConfigSection/OverviewChartSelector'

interface WidgetSettingsFormProps {
  formData: any
  setFormValue: (key: string) => (value: any) => void
}

export default function WidgetSettingsForm({ formData, setFormValue }: WidgetSettingsFormProps) {
  return (
    <div className='space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
      <div className='mb-4'>
        <h2 className='mb-1 text-lg font-semibold text-slate-800'>Widget settings</h2>
        <p className='text-sm text-slate-500'>Configure the basic information for your widget.</p>
      </div>

      <Accordion.Root
        type='multiple'
        defaultValue={['basic', 'chart']}
        className='space-y-3'
      >
        <Accordion.Item
          value='basic'
          className='rounded-lg border border-slate-200'
        >
          <AccordionTrigger>Basic Settings</AccordionTrigger>
          <AccordionContent>
            <BasicSettingsSection
              formData={formData}
              setFormValue={setFormValue}
            />
          </AccordionContent>
        </Accordion.Item>

        <Accordion.Item
          value='chart'
          className='rounded-lg border border-slate-200'
        >
          <AccordionTrigger>Overview Chart</AccordionTrigger>
          <AccordionContent>
            <OverviewChartSection
              formData={formData}
              setFormValue={setFormValue}
            />
          </AccordionContent>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}
