import React, { useMemo } from 'react'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'

interface MultiSelectFormProps<T> {
  formStructure: Record<
    keyof T,
    Omit<FormItem<T[keyof T], any, any, any>, 'setValue'> & { label: keyof T }
  >
  onSubmit: (e: React.FormEvent) => void
  fields: any
  onFormChange: (data: any) => void
}

export default function MultiSelectForm<T>({
  formStructure,
  onSubmit,
  fields,
  onFormChange,
}: MultiSelectFormProps<T>) {
  const { formData, setFormValue } = useCustomForm(fields)

  const formItems = useMemo(() => {
    const updated: Record<string, FormItem<any, any, any, any>> = {}
    for (const key in formStructure) {
      const field = formStructure[key]
      updated[key] = {
        ...field,
        setValue: setFormValue(key),
      }
    }
    return updated
  }, [formStructure, setFormValue])
  console.log(formData, formItems)
  return (
    <div className='mt-2'>
      <FormBuilder
        formData={formData}
        formItems={formItems}
        onFormSubmit={onSubmit}
        loading={false}
        hideSubmitButton
      />
    </div>
  )
}
