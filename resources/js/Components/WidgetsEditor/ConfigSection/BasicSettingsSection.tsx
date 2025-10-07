import Input from '@/ui/form/Input'
import DynamicSelectList from '@/ui/form/DynamicSelectList'

interface BasicSettingsSectionProps {
  formData: {
    title: string
    subtitle: string
    data_table_id: number | null
    subset_group_id: number | null
  }
  setFormValue: (key: string) => (value: any) => void
}

export default function BasicSettingsSection({
  formData,
  setFormValue,
}: BasicSettingsSectionProps) {
  return (
    <div className='space-y-4 px-4'>
      <div className='grid grid-cols-2 gap-4'>
        <Input
          label='Widget title'
          value={formData.title}
          setValue={setFormValue('title')}
        />
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
    </div>
  )
}
