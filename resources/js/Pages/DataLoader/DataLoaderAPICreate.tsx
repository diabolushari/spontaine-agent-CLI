import useCustomForm from '@/hooks/useCustomForm'
import { useMemo, useState } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import { DataLoaderAPI, KeyValue } from '@/interfaces/data_interfaces'
import KeyValueList from '@/Components/DataLoader/KeyValueList/KeyValueList'
import Button from '@/ui/button/Button'
import { usePage } from '@inertiajs/react'
import ErrorText from '@/typography/ErrorText'
import useJsonStructure from '@/Components/DataLoader/SetDataStructure/useJsonStructure'
import SetDataStructure from '@/Components/DataLoader/SetDataStructure/SetDataStructure'

const requestTypes = [
  { method: 'GET', label: 'GET' },
  { method: 'POST', label: 'POST' },
]

interface Props {
  dataLoaderAPI?: DataLoaderAPI
}

export default function DataLoaderAPICreate({ dataLoaderAPI }: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    name: dataLoaderAPI?.name ?? '',
    description: dataLoaderAPI?.description ?? '',
    method: dataLoaderAPI?.method ?? 'GET',
    url: dataLoaderAPI?.url ?? '',
  })

  const [headers, setHeaders] = useState<KeyValue[]>(
    dataLoaderAPI?.headers ?? [{ key: '', value: '' }]
  )
  const [params, setParams] = useState<KeyValue[]>(dataLoaderAPI?.body ?? [{ key: '', value: '' }])

  const {
    dataStructure,
    removeFieldFromJson,
    addNewFieldToJson,
    updateJsonFieldName,
    updateJsonFieldType,
  } = useJsonStructure(
    dataLoaderAPI?.response_structure ?? {
      last_uuid: 1,
      definition: {
        id: 1,
        field_name: 'root',
        field_type: 'array',
        children: [],
      },
    }
  )

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
      method: {
        type: 'select',
        label: 'Method',
        list: requestTypes,
        setValue: setFormValue('method'),
        displayKey: 'label',
        dataKey: 'method',
      },
      url: {
        type: 'text',
        label: 'URL',
        setValue: setFormValue('url'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  const customFormData = useMemo(() => {
    return {
      ...formData,
      headers,
      response_structure: dataStructure,
      body: params,
    }
  }, [formData, headers, params, dataStructure])

  const { errors } = usePage().props as { errors: Record<string, string | undefined> }

  return (
    <FormPage
      url={
        dataLoaderAPI == null
          ? route('loader-apis.store')
          : route('loader-apis.update', { dataLoaderAPI: dataLoaderAPI.id })
      }
      formData={formData}
      formItems={formItems}
      title={dataLoaderAPI == null ? 'Create API' : 'Update API'}
      backUrl={route('loader-apis.index')}
      formStyles='w-1/2 md:grid-cols-1'
      hideSubmitButton={true}
      customSubmitData={customFormData}
      type={'loaders'}
      subtype={'json-apis'}
      isPatchRequest={dataLoaderAPI != null}
    >
      <div className='flex flex-col gap-5'>
        <div>
          <h3>Request Headers</h3>
          {errors['headers'] != null && <ErrorText>{errors['headers']}</ErrorText>}
          <KeyValueList
            list={headers}
            setList={setHeaders}
            errorsKey='headers'
          />
        </div>
        <div>
          <h3>Request Body</h3>
          {errors['body'] != null && <ErrorText>{errors['body']}</ErrorText>}
          <KeyValueList
            list={params}
            setList={setParams}
            errorsKey='body'
          />
        </div>
        <div>
          <h3>Response Structure</h3>
          {errors['response_structure'] != null && (
            <ErrorText>{errors['response_structure']}</ErrorText>
          )}
          <div className='flex flex-col gap-5'>
            <SetDataStructure
              definition={dataStructure.definition}
              addNewFieldToJson={addNewFieldToJson}
              removeFieldFromJson={removeFieldFromJson}
              updateJsonFieldName={updateJsonFieldName}
              updateJsonFieldType={updateJsonFieldType}
            />
          </div>
        </div>
        <div className='flex'>
          <Button label='SAVE' />
        </div>
      </div>
    </FormPage>
  )
}
