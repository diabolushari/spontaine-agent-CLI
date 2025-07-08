import { X } from 'lucide-react'
import { memo, useState, FormEvent } from 'react'

import Modal from '@/Components/Modal'
import Input from '@/ui/form/Input'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import DeleteButton from '@/ui/button/DeleteButton'
import Checkbox from '@/Components/Checkbox'
import SelectList from '@/ui/form/SelectList'
import { useOverviewForm, Filter } from './hooks/useOverviewForm'

import {
    OverviewTable,
} from '@/interfaces/data_interfaces'

type NewGridItem = OverviewTable & { id: number }

interface AddGridItemModalProps {
    isModalOpen: boolean
    setIsModalOpen: (isOpen: boolean) => void
    subsetGroupId: number
    onSave: (newItem: NewGridItem) => void
}

const operatorOptions = [
    { value: 'equals', name: 'Equals' },
    { value: 'not_equals', name: 'Not Equals' },
    { value: 'greater_than', name: 'Greater Than' },
    { value: 'less_than', name: 'Less Than' },
]


function AddGridItemModal({
    isModalOpen,
    setIsModalOpen,
    subsetGroupId,
    onSave,
}: AddGridItemModalProps) {
    // Centralized logic from the custom hook
    const {
        title,
        setTitle,
        subsets,
        metrics,
        selectedMetric,
        setSelectedMetric,
        dimensions,
        selectedSubsetDetailId,
        setSelectedSubsetDetailId,
        filters,
        addFilter,
        removeFilter,
        updateFilter,
        availableValues,
        isLoading,
        error,
        resetAllState,
    } = useOverviewForm(subsetGroupId, isModalOpen)

    // State specific to this modal's UI
    const [colSpan2, setColSpan2] = useState(false)

    const handleClose = () => {
        setIsModalOpen(false)
        resetAllState() // Reset hook state
        setColSpan2(false) // Reset local state
    }

    const handleSave = (e: FormEvent) => {
        e.preventDefault()
        if (!selectedSubsetDetailId || !selectedMetric) return; // Guard against incomplete form

        const newItem: NewGridItem = {
            id: Date.now(),
            title: title,
            subset_id: String(selectedSubsetDetailId),
            measure_field: selectedMetric,
            // Remove the client-side `id` from filters before saving
            filters: filters.map(({ id, ...rest }) => rest),
            col_span_2: colSpan2,
        }
        onSave(newItem)
        handleClose()
    }

    const renderFilterRow = (filter: Filter) => {
        // Get all dimensions that are currently selected in *other* filters.
        const selectedDimensions = filters
            .filter((f) => f.id !== filter.id)
            .map((f) => f.dimension)

        // The available dimensions for the current filter row are those that are not selected in other filters.
        const availableDimensions = dimensions.filter(
            (dim) => !selectedDimensions.includes(dim.subset_column)
        )

        return (
            <div key={filter.id} className="grid grid-cols-12 gap-x-2 items-end">
                <div className="col-span-4">
                    {/* Use SelectList with the filtered list of available dimensions */}
                    <SelectList
                        label="Dimension"
                        list={availableDimensions}
                        dataKey="subset_column"
                        displayKey="subset_field_name"
                        value={filter.dimension}
                        setValue={(value: string) =>
                            updateFilter(filter.id, 'dimension', value)
                        }
                        disabled={!selectedSubsetDetailId || isLoading.details}
                    />
                </div>
            <div className="col-span-3">
                <SelectList
                    label="Operator"
                    list={operatorOptions}
                    dataKey="value"
                    displayKey="name"
                    value={filter.operator}
                    setValue={(value: string) => updateFilter(filter.id, 'operator', value)}
                />
            </div>
            <div className="col-span-4">
                 {/* Use SelectList with dynamically fetched values from the hook */}
                <SelectList
                    label="Value"
                    // Use a unique key to ensure the component re-renders when the dimension changes
                    key={`val-${filter.dimension}`}
                    list={availableValues[filter.dimension] || []}
                    dataKey="name"
                    displayKey="name"
                    value={filter.value}
                    setValue={(value: string) => updateFilter(filter.id, 'value', value)}
                    // Disable if no dimension is selected or if values are currently loading
                    disabled={!filter.dimension || isLoading.values[filter.dimension]}
                />
            </div>
            <div className="col-span-1">
                <DeleteButton onClick={() => removeFilter(filter.id)} />
            </div>
        </div>
        )
    }

    return (
        <Modal show={isModalOpen} onClose={handleClose} maxWidth="2xl">
            <form onSubmit={handleSave} className="p-6">
                <div className="flex items-center justify-between pb-4 border-b">
                    <h2 className="text-lg font-medium text-gray-900">Add Grid Item</h2>
                    <button type="button" className="text-gray-400 hover:text-gray-500" onClick={handleClose}>
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>

                {error && <div className="mt-4 p-3 text-red-800 bg-red-100 border border-red-300 rounded-md">{error}</div>}

                <div className="mt-6 space-y-6">
                    <Input
                        label="Title"
                        value={title}
                        setValue={setTitle}
                        required
                        type="text"
                    />

                    <SelectList
                        label="Data Subset"
                        list={subsets}
                        dataKey="subset_detail_id"
                        displayKey="name"
                        value={selectedSubsetDetailId}
                        setValue={(value: string | number) => setSelectedSubsetDetailId(Number(value))}
                        disabled={isLoading.subsets}
                        required
                    />

                    <SelectList
                        label="Metric"
                        // Add key to ensure the component and its selected value are reset when the subset changes
                        key={selectedSubsetDetailId}
                        list={metrics}
                        dataKey="subset_column"
                        displayKey="subset_field_name"
                        value={selectedMetric}
                        setValue={setSelectedMetric}
                        disabled={!selectedSubsetDetailId || isLoading.details}
                        required
                    />

                    <div>
                        <InputLabel>Filters</InputLabel>
                        <div className="mt-2 space-y-4">{filters.map(renderFilterRow)}</div>
                        <SecondaryButton
                            type="button"
                            className="mt-4"
                            onClick={addFilter}
                            disabled={!selectedSubsetDetailId || isLoading.details}
                        >
                            Add Filter
                        </SecondaryButton>
                    </div>

                    <div className="flex items-center">
                        <Checkbox
                            id="col_span_2"
                            name="col_span_2"
                            checked={colSpan2}
                            onChange={() => setColSpan2(prev => !prev)}
                        />
                        <InputLabel htmlFor="col_span_2" className="ml-2">
                            2-column width
                        </InputLabel>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-2 pt-4 border-t">
                    <SecondaryButton type="button" onClick={handleClose}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton
                      type="submit"
                      disabled={!title || !selectedSubsetDetailId || !selectedMetric}
                    >
                      Save
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    )
}

export default memo(AddGridItemModal)