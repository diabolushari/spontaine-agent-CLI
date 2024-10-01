import { MetaData, MetaStructure } from '@/interfaces/meta_interfaces'
import useCustomForm from '@/hooks/useCustomForm'
import { Paginator } from '@/ui/ui_interfaces'
import { useCallback, useMemo } from 'react'
import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { router } from '@inertiajs/react'

interface Props {
  structures: Partial<MetaStructure>[]
  metaData: Paginator<MetaData>
  type?: string
  subtype?: string
  oldValues?: Record<string, string>
}

export default function MetaDataIndex({ structures, metaData, type, subtype, oldValues }: Props) {
  const { formData, setFormValue } = useCustomForm({
    search: '',
    structure: '',
    type: 'definitions',
    subtype: 'metadata',
  })

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      search: {
        type: 'text',
        label: 'Search',
        setValue: setFormValue('search'),
      },
      structure: {
        type: 'select',
        dataKey: 'id',
        displayKey: 'structure_name',
        label: 'Structure',
        list: structures,
        setValue: setFormValue('structure'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, structures])

  const data = useMemo(() => {
    return metaData.data.map((metaData) => ({
      id: metaData.id,
      name: metaData.name,
      structure: metaData.meta_structure?.structure_name,

      groups: '0',
      hierarchies: '0',
      actions: [
        {
          title: 'Show',
          url: route('meta-data.show', { id: metaData.id }),
        },
      ],
    }))
  }, [metaData])
  const handleCardClick = useCallback((id: number | string) => {
    router.get(route('meta-data.show', { id: id }))
  }, [])
  const keys = useMemo(() => {
    return [
      { key: 'name', label: 'Name', isCardHeader: true, isLink: true },
      { key: 'structure', label: 'Structure', isShownInCard: true, boxStyles: 'col-span-full' },
      { key: 'groups', label: 'Groups', isShownInCard: true, boxStyles: 'link' },
      { key: 'hierarchies', label: 'Hierarchies', isShownInCard: true, boxStyles: 'justify-end' },
    ] as ListItemKeys<Partial<MetaData>>[]
  }, [])

  return (
    <ListResourcePage
      pageDescription='This section of the application defines standardized data values 
      and structures allowed in data tables. Maintaining standard values and structures helps 
      ensure data in the system remains valid,
       and can automatically be rolled-up as necessary into higher levels of reporting.'
      keys={keys}
      primaryKey='id'
      rows={data}
      formData={formData}
      formItems={formItems}
      addUrl={route('meta-data.create')}
      title={'Meta Data'}
      searchUrl={route('meta-data.index')}
      type={type ?? 'definitions'}
      subtype={subtype ?? 'metadata'}
      oldValues={oldValues}
      formStyles='bg-[#F5F5FA] p-4 rounded-lg'
      subheading='Metadata elements that will form valid reporting dimension. Each metdata element will be a distinct value of a structural block.
e.g: "Yellow" is a valid dimensional value of a structural block called "Colour"'
      handleCardClick={handleCardClick}
      gridStyles='grid-cols-2'
      cardStyles=''
    />
  )
}
