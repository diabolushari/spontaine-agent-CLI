import React from 'react';
import { FormEvent, memo, ChangeEvent, useState } from 'react'
import { X } from 'lucide-react'
import { useOverviewForm, Filter } from './hooks/useOverviewForm'
import { SubsetDimensionField } from '@/interfaces/data_interfaces'
import Modal from '@/Components/Modal'
import Input from '@/ui/form/Input'
import InputLabel from '@/Components/InputLabel'
import SelectList from '@/ui/form/SelectList'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import DeleteButton from '@/ui/button/DeleteButton'
import Checkbox from '@/Components/Checkbox'

// Operator options for the filter rows.
const operatorOptions = [
    { value: 'equals', name: 'Equals' },
    { value: 'not_equals', name: 'Not Equals' },
    { value: 'greater_than', name: 'Greater Than' },
    { value: 'less_than', name: 'Less Than' },
]

interface AddGridItemModalProps {
    isModalOpen: boolean
    setIsModalOpen: (isOpen: boolean) => void
    subsetGroupId: number
    onSave: (newItem: any) => void
}

function AddGridItemModal({ isModalOpen, setIsModalOpen, subsetGroupId, onSave }: AddGridItemModalProps) {
    const form = useOverviewForm(subsetGroupId, isModalOpen)
    const [colSpan2, setColSpan2] = useState(false)

    const handleSave = (e: FormEvent) => {
        e.preventDefault()
        const newItem = {
            id: Date.now(),
            title: form.title,
            subset_id: String(form.selectedSubsetDetailId),
            measure_field: [form.selectedMetric],
            show_total: false,
            grid_number: 1,
            filters: form.filters.map(({ id, ...rest }) => rest),
            col_span_2: colSpan2,
        }
        onSave(newItem)
        handleClose()
    }

    const handleClose = () => {
        setIsModalOpen(false)
        form.resetAllState()
    }

    const renderFilterRow = (filter: Filter) => {
        const dimensionOptions = form.dimensions.map((d: SubsetDimensionField) => ({
            id: d.subset_column,
            name: d.subset_field_name,
        }))

        const valueOptions = form.availableValues[filter.dimension]
            ? form.availableValues[filter.dimension].map((v) => ({ name: v.name, id: v.name }))
            : []

        return (
            <div key={filter.id} className="grid grid-cols-12 gap-x-2 items-end">
                <div className="col-span-4">
                    <SelectList
                        label="Dimension"
                        list={dimensionOptions}
                        dataKey="id"
                        displayKey="name"
                        value={filter.dimension}
                        setValue={(value: string) => form.updateFilter(filter.id, 'dimension', value)}
                    />
                </div>
                <div className="col-span-3">
                    <SelectList
                        label="Operator"
                        list={operatorOptions}
                        dataKey="value"
                        displayKey="name"
                        value={filter.operator}
                        setValue={(value: string) => form.updateFilter(filter.id, 'operator', value)}
                    />
                </div>
                <div className="col-span-4">
                    <SelectList
                        label="Value"
                        list={valueOptions}
                        dataKey="id"
                        displayKey="name"
                        value={filter.value}
                        setValue={(value: string) => form.updateFilter(filter.id, 'value', value)}
                        disabled={!filter.dimension || form.isLoading.values[filter.dimension]}
                    />
                </div>
                <div className="col-span-1">
                    <DeleteButton onClick={() => form.removeFilter(filter.id)} />
                </div>
            </div>
        )
    }

    return (
        <Modal show={isModalOpen} onClose={handleClose} maxWidth="2xl">
            <form onSubmit={handleSave} className="p-6">
                <div className="flex items-center justify-between pb-4 border-b">
                    <h2 className="text-lg font-medium text-gray-900">Add Grid Item</h2>
                    <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={handleClose}
                    >
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>

                <div className="mt-6 space-y-6">
                    <div>
                        <Input
                            label="Title"
                            value={form.title}
                            setValue={(value: string) => form.setTitle(value)}
                            required
                            type='text'
                        />
                    </div>

                    <SelectList
                        label="Data Subset"
                        list={form.subsets}
                        dataKey="subset_detail_id"
                        displayKey="name"
                        value={String(form.selectedSubsetDetailId)}
                        setValue={(value: string | number) => form.setSelectedSubsetDetailId(Number(value))}
                        disabled={form.isLoading.subsets}
                        error={form.error ?? undefined}
                    />

                    <SelectList
                        label="Metric"
                        list={form.metrics}
                        dataKey="id"
                        displayKey="subset_field_name"
                        value={form.selectedMetric}
                        setValue={(value: string) => form.setSelectedMetric(value)}
                        disabled={!form.selectedSubsetDetailId || form.isLoading.details}
                    />

                    <div>
                        <InputLabel>Filters</InputLabel>
                        <div className="mt-2 space-y-4">{form.filters.map(renderFilterRow)}</div>
                        <SecondaryButton
                            type="button"
                            className="mt-4"
                            onClick={form.addFilter}
                            disabled={!form.selectedSubsetDetailId || form.dimensions.length === 0}
                        >
                            Add Filter
                        </SecondaryButton>
                    </div>

                    <div className="flex items-center">
                        <Checkbox
                            id="col_span_2"
                            name="col_span_2"
                            checked={colSpan2}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setColSpan2(e.target.checked)}
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
                    <PrimaryButton type="submit">Save</PrimaryButton>
                </div>
            </form>
        </Modal>
    )
}

export default memo(AddGridItemModal)