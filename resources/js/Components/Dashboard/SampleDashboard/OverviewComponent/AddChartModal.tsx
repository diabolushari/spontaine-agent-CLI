import React, { FormEvent, memo, useState } from 'react'
import { useOverviewForm } from './hooks/useOverviewForm'
import {
  OverviewChart,
  SubsetGroupItem,
  SubsetMeasureField,
  SubsetDimensionField,
} from '@/interfaces/data_interfaces'
import Modal from '@/Components/Modal'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import { chartPallet } from '@/Components/Charts/SampleChart/ColorPallets'

const colorSchemeOptions = Object.keys(chartPallet).map((key) => ({
  id: key,
  name: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
  colors: chartPallet[key as keyof typeof chartPallet],
}));

function AddChartModal({ isModalOpen, setIsModalOpen, subsetGroupId, onSave }: AddChartModalProps) {
  const form = useOverviewForm(subsetGroupId, isModalOpen);
  const [chartType, setChartType] = useState('bar');
  const [selectedDimension, setSelectedDimension] = useState('');
  const [selectedColorScheme, setSelectedColorScheme] = useState(colorSchemeOptions[0]?.id || 'boldWarm');
  const [itemCount, setItemCount] = useState<number | ''>('');

  const currentColorSchemeObject = colorSchemeOptions.find(
    (scheme) => scheme.id === selectedColorScheme
  );

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const newChart: OverviewChart = {
      title: form.title,
      subset_id: String(form.selectedSubsetDetailId),
      chart_type: chartType,
      x_axis: selectedDimension,
      y_axis: [form.selectedMetric],
      color_scheme: selectedColorScheme,
      item_count: itemCount ? Number(itemCount) : undefined,
    };
    onSave(newChart);
    handleClose();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    form.resetAllState();
    setSelectedDimension('');
    setSelectedColorScheme(colorSchemeOptions[0]?.id || 'boldWarm');
    setItemCount('');
  };

  const chartTypeOptions = [
    { id: 'bar', name: 'Bar' },
    { id: 'line', name: 'Line' },
    { id: 'pie', name: 'Pie' },
  ];

  const dimensionOptions = form.dimensions.map((d: SubsetDimensionField) => ({
    id: d.subset_column,
    name: d.subset_field_name,
  }));

  const metricOptions = form.metrics.map((m: SubsetMeasureField) => ({
    id: m.subset_column,
    name: m.subset_field_name,
  }));

  return (
    <Modal show={isModalOpen} onClose={handleClose}>
      <form onSubmit={handleSave} className="p-6">
        <h2 className="text-lg font-medium text-gray-900">Add New Chart</h2>
        <div className="mt-6 space-y-4">
          <div>
            <Input label="Title" value={form.title} setValue={form.setTitle} required />
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

          <div>
            <SelectList
              label="Color Scheme"
              list={colorSchemeOptions.map(({ id, name }) => ({ id, name }))}
              dataKey="id"
              displayKey="name"
              value={selectedColorScheme}
              setValue={setSelectedColorScheme}
            />
           
            {currentColorSchemeObject && (
              <div className="mt-2 flex items-center space-x-2 pl-1">
                {currentColorSchemeObject.colors.map((color) => (
                  <div
                    key={color}
                    className="h-5 w-5 rounded-full border border-gray-400 shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color} // Shows the hex code on hover
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <Input
              label="Number of Items to Show"
              type="number"
              value={itemCount}
              setValue={(val) => setItemCount(val === '' ? '' : Number(val))}
              placeholder="Leave blank to show all"
              min="1"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
          <PrimaryButton className="ml-3">Save</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}

export default memo(AddChartModal);