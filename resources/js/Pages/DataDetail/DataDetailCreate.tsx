import { ReferenceData, SubjectArea } from '@/interfaces/data_interfaces'
import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'

interface Props {
  subjectAreas: Pick<SubjectArea, 'id' | 'name'>[]
  types: ReferenceData[]
}

export default function DataDetailCreate({ subjectAreas, types }: Props) {
  const { formData, setFormValue } = useCustomForm({
    name: '',
    description: '',
    type: '',
    subject_area_id: '',
    is_active: true,
  })

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      name: {
        type: 'text',
        label: 'Name',
        setValue: setFormValue('name'),
      },
      description: {
        type: 'textarea',
        label: 'Description',
        setValue: setFormValue('description'),
      },
      type: {
        type: 'select',
        label: 'Type',
        list: types,
        displayKey: 'value_one',
        dataKey: 'value_one',
        showAllOption: true,
        allOptionText: 'Select Type',
        setValue: setFormValue('type'),
      },
      subject_area_id: {
        type: 'select',
        label: 'Subject Area',
        list: subjectAreas,
        displayKey: 'name',
        dataKey: 'id',
        showAllOption: true,
        allOptionText: 'Select Subject Area',
        setValue: setFormValue('subject_area_id'),
      },
      is_active: {
        type: 'checkbox',
        label: 'Is Active',
        setValue: setFormValue('is_active'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  return (
    <FormPage
      url={route('data-detail.store')}
      formData={formData}
      formItems={formItems}
      title='Create Data Detail'
      backUrl={route('data-detail.index')}
      formStyles='w-1/2 md:grid-cols-1'
    />
  )
}
