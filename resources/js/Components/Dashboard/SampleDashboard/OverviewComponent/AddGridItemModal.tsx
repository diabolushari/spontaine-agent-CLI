import React, { useMemo } from 'react'
import { Filter, useOverviewForm } from './hooks/useOverviewForm'
import Input from '@/ui/form/Input'
import {
  SubsetDimensionField,
  SubsetGroupItem,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'

// --- Component Prop Interfaces ---
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

interface SelectFieldProps {
  label: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  loading: boolean
  disabled: boolean
  children: React.ReactNode
}

// Use OverviewTable typing for new grid item config
import type { OverviewTable } from '@/interfaces/data_interfaces'

interface NewItemConfig extends OverviewTable {
  col_span_2: boolean
  filters?: Omit<Filter, 'id'>[]
}

// Explicit type alias for grid config used in this modal
// This matches the NewItemConfig structure already present
export type OverviewGridConfig = NewItemConfig;

interface AddGridItemModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onSave: (config: OverviewGridConfig) => void
  readonly subsetGroupId: number
}

// --- Reusable Components with Full Styling ---
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='relative min-h-[200px] w-full max-w-lg rounded-lg bg-white p-6 shadow-xl'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 text-gray-400 hover:text-gray-600'
          aria-label='Close modal'
        >
          <svg
            className='h-6 w-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
        {title && (
          <h3 className='mb-4 border-b pb-2 text-lg font-semibold text-gray-900'>{title}</h3>
        )}
        <div>{children}</div>
      </div>
    </div>
  )
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  loading,
  disabled,
  children,
}) => {
  let placeholder = `Select a ${label.toLowerCase().split(' (')[0]}`
  if (disabled && !loading && label.startsWith('Metric')) {
    placeholder = 'Select a subset first'
  }
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700'>{label}</label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className='mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:bg-gray-200 sm:text-sm'
      >
        <option
          value=''
          disabled
        >
          {loading ? 'Loading...' : placeholder}
        </option>
        {children}
      </select>
    </div>
  )
}

interface FilterFieldProps {
  filter: Filter
  updateFilter: (id: number, key: keyof Filter, value: string) => void
  availableValues: { [key: string]: { name: string }[] }
  isLoading: { [key: string]: boolean }
  selectedSubsetDetailId: number | ''
}

const FilterField: React.FC<FilterFieldProps> = ({
  filter,
  updateFilter,
  availableValues,
  isLoading,
  selectedSubsetDetailId,
}) => {
  const dimensionsUsedInOtherFilters = useMemo(
    () =>
      Object.values(availableValues).reduce((acc, values) => {
        acc.push(...values.map((value) => value.name))
        return acc
      }, []),
    [availableValues]
  )

  return (
    <div className='flex items-end space-x-2'>
      <select
        value={filter.dimension}
        onChange={(e) => updateFilter(filter.id, 'dimension', e.target.value)}
        disabled={!selectedSubsetDetailId || isLoading[filter.dimension]}
        className='mt-1 block w-full flex-1 rounded-md border-gray-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:bg-gray-200 sm:text-sm'
      >
        <option
          value=''
          disabled
        >
          Dimension
        </option>
        {Object.keys(availableValues).map((dimension) => (
          <option
            key={dimension}
            value={dimension}
          >
            {dimension}
          </option>
        ))}
      </select>
      <select
        value={filter.operator}
        onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
        disabled={!filter.dimension}
        className='mt-1 block w-auto rounded-md border-gray-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:bg-gray-200 sm:text-sm'
      >
        <option value='equals'>equals</option>
      </select>
      <select
        value={filter.value}
        onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
        disabled={!filter.dimension || isLoading[filter.dimension]}
        className='mt-1 block w-full flex-1 rounded-md border-gray-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:bg-gray-200 sm:text-sm'
      >
        <option
          value=''
          disabled
        >
          {isLoading[filter.dimension] ? 'Loading...' : 'Value'}
        </option>
        {availableValues[filter.dimension].map((val) => (
          <option
            key={val.name}
            value={val.name}
          >
            {val.name}
          </option>
        ))}
      </select>
      <button
        type='button'
        onClick={() => updateFilter(filter.id, 'delete', '')}
        className='rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
      >
        <svg
          className='h-5 w-5'
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path
            fillRule='evenodd'
            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
            clipRule='evenodd'
          />
        </svg>
      </button>
    </div>
  )
}

// --- Main Component ---
export default function AddGridItemModal({
  isOpen,
  onClose,
  onSave,
  subsetGroupId,
}: AddGridItemModalProps) {
  const {
    title,
    setTitle,
    subsets,
    metrics,
    dimensions,
    selectedSubsetDetailId,
    setSelectedSubsetDetailId,
    selectedMetric,
    setSelectedMetric,
    filters,
    addFilter,
    removeFilter,
    updateFilter,
    availableValues,
    isLoading,
    error,
    resetAllState,
  } = useOverviewForm(subsetGroupId, isOpen)

  const [colSpan2, setColSpan2] = React.useState(false)

  const handleClose = () => {
    resetAllState()
    onClose()
  }

  const handleSaveChanges = () => {
    if (!selectedMetric) return
    const newItemConfig: OverviewTable = {
      id: Date.now(),
      title,
      subset_id: String(selectedSubsetDetailId),
      measure_field: [selectedMetric],
      show_total: false,
      grid_number: 1,
      filters: filters.map(({ id: _, ...rest }) => rest),
      col_span_2: colSpan2,
    }
    onSave(newItemConfig)
    handleClose()
  }

  const areFiltersValid = filters.every((f) => f.dimension && f.operator && f.value)
  const isSaveDisabled =
    !title ||
    !selectedSubsetDetailId ||
    !selectedMetric || // Ensure a metric is always selected
    !areFiltersValid ||
    isLoading.subsets ||
    isLoading.details ||
    Object.values(isLoading.values).some(Boolean)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title='Add New Grid Item'
    >
      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='col-span-2'
            checked={colSpan2}
            onChange={(e) => setColSpan2(e.target.checked)}
            className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
          />
          <label htmlFor='col-span-2' className='text-sm text-gray-700'>2-column width</label>
        </div>
        {error && <div className='rounded-md bg-red-100 p-3 text-red-500'>{error}</div>}
        <Input
          label='Title for the new item'
          value={title}
          setValue={setTitle}
          placeholder='e.g., Arrears (0-3 Months)'
        />
        <SelectField
          label='Data Subset'
          value={selectedSubsetDetailId}
          onChange={(e) => setSelectedSubsetDetailId(Number(e.target.value))}
          loading={isLoading.subsets}
          disabled={isLoading.subsets}
        >
          {subsets.map((s: SubsetGroupItem) => (
            <option
              key={s.id}
              value={s.subset_detail_id}
            >
              {s.name}
            </option>
          ))}
        </SelectField>

        <div className='space-y-3 rounded-md border border-gray-200 p-3'>
          <div className='block text-sm font-medium text-gray-700'>Filters</div>
          {filters.length === 0 && <p className='text-sm text-gray-500'>No filters applied.</p>}
          {/* Wrap mapped filters in a fragment to ensure valid JSX */}
          <>{filters.map((filter) => (
            <div key={filter.id} className='flex items-end space-x-2'>
              <select
                value={filter.dimension}
                onChange={(e) => updateFilter(filter.id, 'dimension', e.target.value)}
                disabled={!selectedSubsetDetailId || isLoading.details}
                className='mt-1 block w-full flex-1 rounded-md border-gray-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:bg-gray-200 sm:text-sm'
              >
                <option value='' disabled>Dimension</option>
                {dimensions
                  .filter((d) => d.subset_field_name.toLowerCase() !== 'month')
                  .map((d) => (
                    <option key={d.id} value={d.subset_column}>
                      {d.subset_field_name}
                    </option>
                  ))}
              </select>
              <select
                value={filter.operator}
                onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                disabled={!filter.dimension}
                className='mt-1 block w-auto rounded-md border-gray-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:bg-gray-200 sm:text-sm'
              >
                <option value='equals'>equals</option>
              </select>
              <select
                value={filter.value}
                onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                disabled={!filter.dimension || isLoading.values[filter.dimension]}
                className='mt-1 block w-full flex-1 rounded-md border-gray-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:bg-gray-200 sm:text-sm'
              >
                <option value='' disabled>{isLoading.values[filter.dimension] ? 'Loading...' : 'Value'}</option>
                {(availableValues[filter.dimension] || []).map((val) => (
                  <option key={val.name} value={val.name}>
                    {val.name}
                  </option>
                ))}
              </select>
              <button
                type='button'
                onClick={() => removeFilter(filter.id)}
                className='rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              >
                <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          ))}</>
          <button
            type='button'
            onClick={addFilter}
            disabled={!selectedSubsetDetailId || isLoading.details}
            className='mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:cursor-not-allowed disabled:text-gray-400'
          >
            + Add Filter
          </button>
        </div>
        <SelectField
          label='Metric (Value to Display)'
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          loading={isLoading.details}
          disabled={!selectedSubsetDetailId || isLoading.details}
        >
          {metrics.map((m: SubsetMeasureField) => (
            <option
              key={m.id}
              value={m.subset_column}
            >
              {m.subset_field_name}
            </option>
          ))}
        </SelectField>
      </div>
      <div className='mt-6 flex justify-end space-x-3 border-t pt-6'>
        <button
          type='button'
          onClick={handleClose}
          className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
        >
          Cancel
        </button>
        <button
          type='button'
          onClick={handleSaveChanges}
          disabled={isSaveDisabled}
          className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300'
        >
          Save
        </button>
      </div>
    </Modal>
  )
}
