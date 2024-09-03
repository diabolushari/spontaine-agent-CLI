import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { FormEvent, useMemo } from 'react'
import { MetaStructure } from '@/interfaces/meta_interfaces'

interface Props {
  fieldType: 'date' | 'dimension' | 'measure'
  structures: Pick<MetaStructure, 'id' | 'structure_name'>[]
  onFormSubmit: (
    type: string,
    data: {
      field_name: string
      unit_field_name?: string
      meta_structure_id?: string
    }
  ) => void
}

export const possibleDateFields = ['date_1', 'date_2', 'date_3', 'date_4', 'date_5']
export const possibleDimensionFields = [
  'dimension_1',
  'dimension_2',
  'dimension_3',
  'dimension_4',
  'dimension_5',
  'dimension_6',
  'dimension_7',
  'dimension_8',
]

//measures 1- 8
export const possibleMeasureFields = [
  'measure_1',
  'measure_1_unit',
  'measure_2',
  'measure_2_unit',
  'measure_3',
  'measure_4_unit',
  'measure_5',
  'measure_5_unit',
  'measure_6',
  'measure_6_unit',
  'measure_7',
  'measure_7_unit',
  'measure_8',
  'measure_8_unit',
]

export default function DataTableFieldInfoForm({
  fieldType,
  structures,
  onFormSubmit,
}: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    field_name: '',
    unit_field_name: '', // only for measure fields
    meta_structure_id: '', // only for  dimension fields
  })

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      field_name: { type: 'text', label: 'Field Name', setValue: setFormValue('field_name') },
      unit_field_name: {
        type: 'text',
        label: 'Unit Field',
        setValue: setFormValue('unit_field_name'),
        hidden: fieldType !== 'measure',
      },
      meta_structure_id: {
        type: 'select',
        label: 'Data Structure',
        list: structures,
        displayKey: 'structure_name',
        dataKey: 'id',
        setValue: setFormValue('meta_structure_id'),
        hidden: fieldType !== 'dimension',
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, fieldType, structures])

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onFormSubmit(fieldType, formData)
  }

  return (
    <div className='flex flex-col p-2'>
      <FormBuilder
        formItems={formItems}
        formData={formData}
        loading={false}
        onFormSubmit={submitForm}
        buttonText='ADD'
        formStyles='w-full grid-cols-1 gap-2'
      />
    </div>
  )
}
