import React, { FormEvent, memo, useState, ChangeEvent } from 'react'
import { useOverviewForm } from './hooks/useOverviewForm'
import {
  OverviewChart,
  SubsetGroupItem,
  SubsetMeasureField,
  SubsetDimensionField,
} from '@/interfaces/data_interfaces'
import Modal from '@/Components/Modal'
import Input from '@/ui/form/Input'
import InputLabel from '@/Components/InputLabel'
import SelectList from '@/ui/form/SelectList'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'

interface AddChartModalProps {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  subsetGroupId: number
  onSave: (newChart: OverviewChart) => void
}

function AddChartModal({ isModalOpen, setIsModalOpen, subsetGroupId, onSave }: AddChartModalProps) {
  const form = useOverviewForm(subsetGroupId, isModalOpen)
  const [chartType, setChartType] = useState('bar')
  const [selectedDimension, setSelectedDimension] = useState('')

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    const newChart: OverviewChart = {
      title: form.title,
      subset_id: String(form.selectedSubsetDetailId),
      chart_type: chartType,
      x_axis: selectedDimension,
      y_axis: [form.selectedMetric],
    }
    onSave(newChart)
    handleClose()
  }

  const handleClose = () => {
    setIsModalOpen(false)
    form.resetAllState()
    setSelectedDimension('')
  }

  const chartTypeOptions = [
    { id: 'bar', name: 'Bar' },
    { id: 'line', name: 'Line' },
    { id: 'pie', name: 'Pie' },
  ]

  const dimensionOptions = form.dimensions.map((d: SubsetDimensionField) => ({
    id: d.subset_column,
    name: d.subset_field_name,
  }))

  const metricOptions = form.metrics.map((m: SubsetMeasureField) => ({
    id: m.subset_column,
    name: m.subset_field_name,
  }))

  return (
    <Modal show={isModalOpen} onClose={handleClose}>
      <form onSubmit={handleSave} className="p-6">
        <h2 className="text-lg font-medium text-gray-900">Add New Chart</h2>

        <div className="mt-6 space-y-4">
          <div>
            <Input
              label="Title"
              value={form.title}
              setValue={form.setTitle}
              required
            />
          </div>

          <div>
            <SelectList
              label="Subset"
              list={form.subsets.map((s: SubsetGroupItem) => ({ id: s.subset_detail_id, name: s.name }))}
              dataKey="id"
              displayKey="name"
              value={form.selectedSubsetDetailId}
              setValue={(value: string | number) => form.setSelectedSubsetDetailId(Number(value))}
            />
          </div>

          <div>
            <SelectList
              label="Chart Type"
              list={chartTypeOptions}
              dataKey="id"
              displayKey="name"
              value={chartType}
              setValue={setChartType}
            />
          </div>

          <div>
            <SelectList
              label="X-Axis (Dimension)"
              list={dimensionOptions}
              dataKey="id"
              displayKey="name"
              value={selectedDimension}
              setValue={setSelectedDimension}
              disabled={!form.selectedSubsetDetailId}
            />
          </div>

          <div>
            <SelectList
              label="Y-Axis (Metric)"
              list={metricOptions}
              dataKey="id"
              displayKey="name"
              value={form.selectedMetric}
              setValue={form.setSelectedMetric}
              disabled={!form.selectedSubsetDetailId}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
          <PrimaryButton className="ml-3">Save</PrimaryButton>
        </div>
      </form>
    </Modal>
  )
}

export default memo(AddChartModal)
