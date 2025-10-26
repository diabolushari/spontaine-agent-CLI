import MeasureFieldSelector from '@/Components/WidgetsEditor/ConfigMeasures/MeasureFieldSelector'
import { SelectedMeasure } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import Input from '@/ui/form/Input'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import { HighlightCardData } from '@/interfaces/data_interfaces'
import { X } from 'lucide-react'
import { useCallback, useMemo } from 'react'

interface HighlightCardProps {
  card: HighlightCardData
  index: number
  subsetGroupId: string
  onTitleChange: (index: number, title: string) => void
  onSubtitleChange: (index: number, subtitle: string) => void
  onSubsetChange: (index: number, subsetId: number) => void
  onMeasureChange: (index: number, measures: SelectedMeasure[]) => void
  onRemove: (index: number) => void
}

export default function HighlightCardConfigForm({
  card,
  index,
  subsetGroupId,
  onTitleChange,
  onSubtitleChange,
  onSubsetChange,
  onMeasureChange,
  onRemove,
}: Readonly<HighlightCardProps>) {
  const measures = useMemo(() => {
    return card.measure == null ? [] : [card.measure]
  }, [card.measure])

  const handleTitleChange = useCallback(
    (value: string) => {
      onTitleChange(index, value)
    },
    [index, onTitleChange]
  )

  const handleSubtitleChange = useCallback(
    (value: string) => {
      onSubtitleChange(index, value)
    },
    [index, onSubtitleChange]
  )

  const handleSubsetChange = useCallback(
    (value: string | number) => {
      onSubsetChange(index, Number(value))
    },
    [index, onSubsetChange]
  )

  const handleMeasuresChange = useCallback(
    (updatedMeasures: SelectedMeasure[]) => {
      onMeasureChange(index, updatedMeasures)
    },
    [index, onMeasureChange]
  )

  const handleRemoveCard = useCallback(() => {
    onRemove(index)
  }, [index, onRemove])

  return (
    <div className='space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm'>
      {/* Card Header */}
      <div className='flex items-center justify-between'>
        <h4 className='text-sm font-medium text-slate-700'>Card {index + 1}</h4>
        <button
          type='button'
          onClick={handleRemoveCard}
          className='flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20'
          aria-label='Remove card'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
      <div className='flex flex-col'>
        <Input
          label='Title'
          value={card.title}
          setValue={handleTitleChange}
          placeholder='Enter title'
        />
      </div>
      <div className='flex flex-col'>
        <Input
          label='Subtitle'
          value={card.subtitle}
          setValue={handleSubtitleChange}
          placeholder='Enter subtitle'
        />
      </div>
      <div>
        <DynamicSelectList
          label='Subset'
          url={`/api/subset-group/${subsetGroupId}`}
          dataKey='subset_detail_id'
          displayKey='name'
          value={card.subset_id ?? undefined}
          setValue={handleSubsetChange}
        />
      </div>
      {card.subset_id && (
        <div className='border-t border-slate-200 pt-3'>
          <MeasureFieldSelector
            subsetId={card.subset_id.toString()}
            measures={measures}
            onMeasuresChange={handleMeasuresChange}
            allowMultiple={false}
            showUnit={true}
          />
        </div>
      )}
    </div>
  )
}
