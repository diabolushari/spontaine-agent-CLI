import { SelectedMeasure, WidgetFormData } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import { Plus } from 'lucide-react'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { HighlightCardData } from '@/interfaces/data_interfaces'
import HighlightCardConfigForm from './HighlightCardConfigForm'

interface HighlightConfigSectionProps {
  formData: WidgetFormData
  highlightCards: HighlightCardData[]
  setHighlightCards: Dispatch<SetStateAction<HighlightCardData[]>>
}

const EMPTY_HIGHLIGHT_CARD: HighlightCardData = {
  title: '',
  subtitle: '',
  subset_id: null,
  measure: { subset_column: '', subset_field_name: '', unit: '' },
}

export default function HighlightConfigSection({
  formData,
  highlightCards,
  setHighlightCards,
}: Readonly<HighlightConfigSectionProps>) {
  const handleAddCard = useCallback(() => {
    if (highlightCards.length < 3) {
      setHighlightCards((prevCards) => [...prevCards, EMPTY_HIGHLIGHT_CARD])
    }
  }, [highlightCards.length, setHighlightCards])

  const handleRemoveCard = useCallback(
    (index: number) => {
      setHighlightCards((prevCards) => prevCards.filter((_, i) => i !== index))
    },
    [setHighlightCards]
  )

  const handleTitleChange = useCallback(
    (index: number, title: string) => {
      setHighlightCards((prevCards) =>
        prevCards.map((card, i) => (i === index ? { ...card, title } : card))
      )
    },
    [setHighlightCards]
  )

  const handleSubtitleChange = useCallback(
    (index: number, subtitle: string) => {
      setHighlightCards((prevCards) =>
        prevCards.map((card, i) => (i === index ? { ...card, subtitle } : card))
      )
    },
    [setHighlightCards]
  )

  const handleSubsetChange = useCallback(
    (index: number, subsetId: number) => {
      setHighlightCards((prevCards) => {
        return prevCards.map((card, i) => {
          if (i === index) {
            return {
              ...card,
              subset_id: subsetId,
              measure: { subset_column: '', subset_field_name: '', unit: '' },
            }
          }
          return card
        })
      })
    },
    [setHighlightCards]
  )

  const handleMeasureChange = useCallback(
    (index: number, measures: SelectedMeasure[]) => {
      if (measures.length === 0) {
        return
      }
      const measure = measures[0]
      setHighlightCards((prevCards) =>
        prevCards.map((card, i) => (i === index ? { ...card, measure } : card))
      )
    },
    [setHighlightCards]
  )

  return (
    <div className='space-y-4 px-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <span className='standard-label text-sm font-normal text-slate-700'>Highlight Cards</span>
        <span className='text-sm text-slate-500'>{highlightCards.length}/3 cards</span>
      </div>

      {/* Cards */}
      <div className='space-y-4'>
        {highlightCards.map((card, index) => (
          <HighlightCardConfigForm
            key={index}
            card={card}
            index={index}
            subsetGroupId={formData?.subset_group_id}
            onTitleChange={handleTitleChange}
            onSubtitleChange={handleSubtitleChange}
            onSubsetChange={handleSubsetChange}
            onMeasureChange={handleMeasureChange}
            onRemove={handleRemoveCard}
          />
        ))}
      </div>

      {/* Add Card Button */}
      {highlightCards.length < 3 && (
        <button
          type='button'
          onClick={handleAddCard}
          className='flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-normal text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200'
        >
          <Plus className='h-4 w-4' />
          <span>Add Highlight Card</span>
        </button>
      )}

      {/* Empty State */}
      {highlightCards.length === 0 && (
        <div className='rounded-lg border border-dashed border-slate-300 bg-slate-50 py-12 text-center'>
          <p className='text-sm text-slate-500'>No highlight cards added yet.</p>
          <p className='mt-1 text-xs text-slate-400'>
            Click &quot;Add Highlight Card&quot; to create one.
          </p>
        </div>
      )}
    </div>
  )
}
