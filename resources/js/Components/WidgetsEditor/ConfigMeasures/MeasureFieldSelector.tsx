import { SelectedMeasure } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import useFetchRecord from '@/hooks/useFetchRecord'
import { Dimension } from '@/interfaces/data_interfaces'
import { Plus, X } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import PickAvailableMeasure from './PickAvailableMeasure'

interface MeasureFieldSelectorProps {
  subsetId: string | null
  measures: SelectedMeasure[]
  onMeasuresChange: (measures: SelectedMeasure[]) => void
  allowMultiple?: boolean
  showUnit?: boolean
}

export default function MeasureFieldSelector({
  subsetId,
  measures,
  onMeasuresChange,
  allowMultiple = true,
  showUnit = false,
}: Readonly<MeasureFieldSelectorProps>) {
  const [availableMeasures] = useFetchRecord<Dimension[]>(
    subsetId ? `/api/subset/${subsetId}` : null
  )

  const usedColumns = measures.map((m) => m.subset_column).filter((col) => col !== '')

  const handleMeasureChange = useCallback(
    (index: number, subsetColumn: string) => {
      const selectedMeasure = availableMeasures?.find((m) => m.subset_column === subsetColumn)
      const updatedMeasures = measures.map((measure, i) => {
        if (i === index && selectedMeasure != null) {
          return {
            subset_column: selectedMeasure.subset_column,
            subset_field_name: selectedMeasure.subset_field_name,
            unit: measure.unit || '',
          }
        }
        return measure
      })
      onMeasuresChange(updatedMeasures)
    },
    [availableMeasures, measures, onMeasuresChange]
  )

  const handleFieldNameChange = useCallback(
    (index: number, subsetFieldName: string) => {
      const updatedMeasures = measures.map((measure, i) => {
        if (i === index) {
          return {
            ...measure,
            subset_field_name: subsetFieldName,
          }
        }
        return measure
      })
      onMeasuresChange(updatedMeasures)
    },
    [measures, onMeasuresChange]
  )

  const handleUnitChange = useCallback(
    (index: number, unit: string) => {
      const updatedMeasures = measures.map((measure, i) => {
        if (i === index) {
          return {
            ...measure,
            unit,
          }
        }
        return measure
      })
      onMeasuresChange(updatedMeasures)
    },
    [measures, onMeasuresChange]
  )

  const handleAddMeasure = useCallback(() => {
    const newMeasures = [...measures, { subset_column: '', subset_field_name: '', unit: '' }]
    onMeasuresChange(newMeasures)
  }, [measures, onMeasuresChange])

  const handleRemoveMeasure = useCallback(
    (index: number) => {
      const updatedMeasures = measures.filter((_, i) => i !== index)
      onMeasuresChange(updatedMeasures)
    },
    [measures, onMeasuresChange]
  )

  const showAddMeasureButton = useMemo(() => {
    if (!allowMultiple && measures.length === 1) {
      return false
    }
    return availableMeasures?.length !== measures.length
  }, [allowMultiple, availableMeasures, measures.length])

  return (
    <>
      <label className='standard-label small-1stop text-sm font-normal text-slate-700'>
        {allowMultiple ? 'Measures' : 'Measure'}
      </label>

      <div className='space-y-4'>
        {measures.map((selectedMeasure, index) => (
          <div
            key={selectedMeasure.subset_column + index}
            className='space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3 transition-colors hover:border-slate-300'
          >
            {allowMultiple && (
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-xs font-medium text-slate-500'>Measure {index + 1}</span>
                <button
                  type='button'
                  onClick={() => handleRemoveMeasure(index)}
                  className='flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20'
                  aria-label='Remove measure'
                >
                  <X className='h-3.5 w-3.5' />
                </button>
              </div>
            )}
            <div className='flex items-center gap-2'>
              <PickAvailableMeasure
                availableMeasures={availableMeasures}
                usedColumns={usedColumns}
                currentIndex={index}
                selectedColumn={selectedMeasure.subset_column}
                onMeasureChange={handleMeasureChange}
              />
            </div>

            {selectedMeasure.subset_column && (
              <div className='flex items-center gap-2'>
                <input
                  type='text'
                  value={selectedMeasure.subset_field_name}
                  onChange={(e) => handleFieldNameChange(index, e.target.value)}
                  placeholder='Custom label (optional)'
                  className='flex-1 appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
                />
                {showUnit && (
                  <input
                    type='text'
                    value={selectedMeasure.unit ?? ''}
                    onChange={(e) => handleUnitChange(index, e.target.value)}
                    placeholder='Unit'
                    className='w-24 appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
                  />
                )}
              </div>
            )}
          </div>
        ))}
        {showAddMeasureButton && (
          <button
            type='button'
            onClick={handleAddMeasure}
            className='flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-normal text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200'
          >
            <Plus className='h-4 w-4' />
            <span>Add Measure</span>
          </button>
        )}
      </div>
    </>
  )
}
