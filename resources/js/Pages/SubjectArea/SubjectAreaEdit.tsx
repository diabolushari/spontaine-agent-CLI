import { SubjectArea } from '@/interfaces/data_interfaces'
import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'

interface Props {
  subjectArea: SubjectArea
}

export default function SubjectAreaEdit({ subjectArea }: Props) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    name: subjectArea.name,
    description: subjectArea.description,
    table_name: subjectArea.table_name,
    is_active: subjectArea.is_active === 1,
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
      table_name: {
        type: 'text',
        label: 'Table Name',
        setValue: setFormValue('table_name'),
        disabled: true,
      },
      is_active: {
        type: 'checkbox',
        label: 'Is Active',
        setValue: toggleBoolean('is_active'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  return (
    <FormPage
      url={route('subject-area.update', subjectArea.id)}
      backUrl={route('subject-area.index')}
      formData={formData}
      formItems={formItems}
      title={`Edit: ${subjectArea.name}`}
      formStyles='md:w-1/2 md:grid-cols-1'
      isPatchRequest
    />
  )
}
