import useCustomForm from '@/hooks/useCustomForm'
import { Block, Config } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import React, { useCallback } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import CheckBox from '@/ui/form/CheckBox'

interface ConfigFormStepRankingFieldsProps {
  initialData: Partial<Config>
  block: Block
  onNext: (data: Partial<Config>) => void
  onBack: () => void
}
const strucetureRanking = (formData: any) => {
  return {
    ranking: {
      subset_id: formData.subset_id ?? null,
      title: formData.title ?? null,
      data_field: formData.subset_id
        ? {
            label: formData.label ?? '',
            value: formData.value ?? '',
            show_label: formData.show_label ?? false,
          }
        : null,
    },
  }
}

export default function ConfigFormStepRanking({
  initialData,
  block,
  onNext,
  onBack,
}: ConfigFormStepRankingFieldsProps) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    title: initialData.ranking?.title ?? 0,
    subset_id: initialData.ranking?.subset_id ?? 0,
    label: initialData.ranking?.data_field?.label ?? '',
    value: initialData.ranking?.data_field?.value ?? '',
    show_label: initialData.ranking?.data_field?.show_label ?? false,
  })

  const { post, loading, errors } = useInertiaPost<Partial<Config> & { _method?: string }>(
    route('config.ranking.update', block.id),
    {
      showErrorToast: true,
      preserveState: true,
      preserveScroll: true,
      onComplete: () => onNext({ ...initialData, ...strucetureRanking(formData) }),
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post({ ...initialData, ...strucetureRanking(formData), _method: 'PUT' })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-4'
    >
      <div className='w-full'>
        {/* Subset Selection */}
        {initialData.subset_group_id && (
          <>
            <div className='col-span-3 flex flex-col'>
              <DynamicSelectList
                label='Select Subset for Ranking'
                url={`/api/subset-group/${initialData.subset_group_id}`}
                dataKey='id'
                displayKey='name'
                value={formData.subset_id?.toString() || ''}
                setValue={setFormValue('subset_id')}
                error={errors?.subset_id}
              />
            </div>
            <div className='col-span-3 flex flex-col'>
              <Input
                label='Subset Title'
                value={formData.title || ''}
                setValue={setFormValue('title')}
                error={errors?.title}
              />
            </div>
          </>
        )}
      </div>

      {/* Ranking Field Selection */}
      {formData.subset_id !== 0 && (
        <div className='grid grid-cols-3 md:gap-4'>
          <div className='flex flex-col'>
            <DynamicSelectList
              label='Select Ranking Field'
              url={`/api/subset/${formData.subset_id}?filter_only=1`}
              dataKey='subset_field_name'
              displayKey='subset_field_name'
              value={formData.value}
              setValue={setFormValue('value')}
              error={errors?.value}
            />
          </div>

          <div className='flex flex-col'>
            <Input
              label='Ranking Label'
              value={formData.label}
              setValue={setFormValue('label')}
              error={errors?.label}
            />
          </div>

          <div className='flex flex-col'>
            <CheckBox
              label='Enable Label for Ranking Field'
              value={formData.show_label}
              toggleValue={toggleBoolean('show_label')}
            />
          </div>
        </div>
      )}

      <div className='mt-4 flex justify-between border-t pt-4'>
        <Button
          type='button'
          label='Back'
          onClick={onBack}
        />
        <Button
          type='submit'
          label='Submit'
        />
      </div>
    </form>
  )
}
