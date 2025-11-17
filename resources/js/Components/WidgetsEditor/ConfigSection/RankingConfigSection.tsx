import MeasureFieldSelector from '@/Components/WidgetsEditor/ConfigMeasures/MeasureFieldSelector'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import { useCallback, useMemo } from 'react'
import { SelectedMeasure, WidgetFormData } from '../OverviewWidgetEditor'
import SelectList from '@/ui/form/SelectList'

interface RankingConfigSectionProps {
  formData: WidgetFormData
  setFormValue: <K extends keyof WidgetFormData>(key: K) => (value: WidgetFormData[K]) => void
}

const levelTypes: { name: string; value: string }[] = [
  { name: 'Section', value: 'section' },
  { name: 'Subdivision', value: 'subdivision' },
  { name: 'Division', value: 'division' },
  { name: 'Circle', value: 'circle' },
  { name: 'Region', value: 'region' },
]

export function RankingConfigSection({
  formData,
  setFormValue,
}: Readonly<RankingConfigSectionProps>) {
  const selectedMeasures = useMemo(() => {
    return formData.rank_ranking_field == null ? [] : [formData.rank_ranking_field]
  }, [formData.rank_ranking_field])

  const updateMeasures = useCallback(
    (measures: SelectedMeasure[]) => {
      if (measures.length > 0) {
        setFormValue('rank_ranking_field')(measures[0])
        return
      }
      setFormValue('rank_ranking_field')(null)
    },
    [setFormValue]
  )

  const handleSubsetChange = useCallback(
    (value: string) => {
      setFormValue('rank_subset_id')(value)
      setFormValue('rank_ranking_field')(null)
    },
    [setFormValue]
  )

  return (
    <div className='space-y-4 px-4'>
      <div className='flex flex-col'>
        <DynamicSelectList
          label='Subset'
          url={`/api/subset-group/${formData?.subset_group_id}`}
          dataKey='subset_detail_id'
          displayKey='name'
          value={formData.rank_subset_id}
          setValue={handleSubsetChange}
        />
      </div>
      <div>
        <MeasureFieldSelector
          subsetId={formData.rank_subset_id}
          measures={selectedMeasures}
          onMeasuresChange={updateMeasures}
          allowMultiple={false}
        />
      </div>
      <div className='flex flex-col'>
        <SelectList
          label={'Default Level'}
          list={levelTypes}
          dataKey={'value'}
          displayKey={'name'}
          setValue={setFormValue('rank_level')}
          value={formData.rank_level}
        />
      </div>
    </div>
  )
}
