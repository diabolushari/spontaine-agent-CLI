import { memo } from 'react'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'

interface Props {
  definition: JSONDefinition
  updateJsonFieldName: (fieldId: number, fieldName: string) => void
  updateJsonFieldType: (fieldId: number, fieldType: JSONFieldType) => void
  addNewFieldToJson: (parentId: number) => void
  removeFieldFromJson: (fieldId: number) => void
}

export type JSONFieldType = 'array' | 'object' | 'primitive' | 'primitive-array'

export interface JSONDefinition {
  id: number
  fieldName: string
  fieldType: JSONFieldType
  children: JSONDefinition[]
}

const fieldTypes = [
  { value: 'array' },
  { value: 'object' },
  { value: 'primitive' },
  { value: 'primitive-array' },
]

function SetDataStructure({
  definition,
  addNewFieldToJson,
  removeFieldFromJson,
  updateJsonFieldName,
  updateJsonFieldType,
}: Readonly<Props>) {
  return (
    <div className='flex flex-col rounded-xl'>
      <div className='flex items-end gap-2 bg-gray-200 p-2'>
        <div className='grid w-full grid-cols-2 gap-1'>
          <div className='flex flex-col'>
            <Input
              setValue={(value) => updateJsonFieldName(definition.id, value)}
              value={definition.fieldName}
              disabled={definition.fieldName === 'root'}
              placeholder='Field Name'
            />
          </div>
          <div className='flex flex-col'>
            <SelectList
              setValue={(value) => updateJsonFieldType(definition.id, value as JSONFieldType)}
              value={definition.fieldType}
              list={fieldTypes}
              dataKey='value'
              displayKey='value'
            />
          </div>
        </div>
        {definition.fieldName !== 'root' && (
          <button
            className='flex-shrink-0 p-2 hover:bg-1stop-accent2'
            type='button'
            onClick={() => removeFieldFromJson(definition.id)}
          >
            <i className='la la-close' />
          </button>
        )}
      </div>
      <div className='flex flex-col pl-5'>
        <div className=''>
          {definition.fieldType === 'array' && (
            <span>
              {definition.children.length} fields in every object of {definition.fieldName} array
            </span>
          )}
          {definition.fieldType === 'object' && (
            <span>
              {definition.children.length} fields in {definition.fieldName} object
            </span>
          )}
        </div>
        <div className='flex flex-col p-2'>
          {definition.children.map((child) => (
            <SetDataStructure
              definition={child}
              key={child.id}
              addNewFieldToJson={addNewFieldToJson}
              removeFieldFromJson={removeFieldFromJson}
              updateJsonFieldName={updateJsonFieldName}
              updateJsonFieldType={updateJsonFieldType}
            />
          ))}
          {definition.fieldType !== 'primitive' && definition.fieldType !== 'primitive-array' && (
            <div className='flex'>
              <button
                className='link'
                type='button'
                onClick={() => addNewFieldToJson(definition.id)}
              >
                Add New Field
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(SetDataStructure)
