import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { FormEvent, useMemo } from 'react'
import { MetaStructure } from '@/interfaces/meta_interfaces'
import { showError } from '@/ui/alerts'

interface Props {
  selectedField: DataTableFieldInfo | null
  onFormSubmit: (data: DataTableFieldInfo) => void
  onDelete?: () => void
}

export interface DataTableFieldInfo {
  type: string
  field_name: string
  unit_field_name?: string
  meta_structure: MetaStructure | null
}

const types = [
  { id: 'date', structure_name: 'Date' },
  { id: 'dimension', structure_name: 'Dimension' },
  { id: 'measure', structure_name: 'Measure' },
]

export default function DataTableFieldInfoForm({
  onFormSubmit,
  selectedField,
  onDelete,
}: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    type: selectedField?.type ?? 'date',
    field_name: selectedField?.field_name ?? '',
    meta_structure: selectedField?.meta_structure ?? (null as MetaStructure | null), // only for dimension fields
    unit_field_name: selectedField?.unit_field_name ?? '', // only for measure fields
  })

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      type: {
        type: 'select',
        label: 'Type',
        list: types,
        displayKey: 'structure_name',
        dataKey: 'id',
        setValue: setFormValue('type'),
      },
      field_name: { type: 'text', label: 'Field Name', setValue: setFormValue('field_name') },
      unit_field_name: {
        type: 'text',
        label: 'Unit Field(Optional)',
        setValue: setFormValue('unit_field_name'),
        hidden: formData.type !== 'measure',
      },
      meta_structure: {
        type: 'autocomplete',
        label: 'Meta Structure',
        autoCompleteSelection: formData.meta_structure,
        dataKey: 'id',
        displayKey: 'structure_name',
        linkText: 'Structural blocks',
        redirectLink: route('meta-structure.index'),
        selectListUrl: route('meta-structure-search', {
          search: '',
        }),
        setValue: setFormValue('meta_structure'),
        hidden: formData.type !== 'dimension',
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, formData.type, formData.meta_structure])

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (formData.field_name === '') {
      showError('Field Name is required')
      return
    }
    if (formData.type === 'dimension' && formData.meta_structure == null) {
      showError('Structure is required')
      return
    }
    onFormSubmit(formData)
  }

  return (
    <div className='flex flex-col p-2'>
      <FormBuilder
        formItems={formItems}
        formData={formData}
        loading={false}
        onFormSubmit={submitForm}
        buttonText={selectedField == null ? 'Add Field' : 'Update Field'}
        formStyles='w-full flex flex-col gap-2'
        showSecondaryButton={selectedField != null}
        secondaryButtonLabel='REMOVE'
        secondaryAction={onDelete}
      />
    </div>
  )
}
