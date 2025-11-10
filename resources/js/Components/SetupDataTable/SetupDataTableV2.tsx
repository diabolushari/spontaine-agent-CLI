import React, { useEffect, useMemo, useState } from 'react'
import Step from '@/Components/SetupDataTable/V2/Step'
import Step2QuerySelection from '@/Components/SetupDataTable/V2/Steps/Step2QuerySelection'
import Step3QueryPreview from '@/Components/SetupDataTable/V2/Steps/Step3QueryPreview'
import Step4QueryFieldConfig from '@/Components/SetupDataTable/V2/Steps/Step4QueryFieldConfig'
import Step1DataSource from '@/Components/SetupDataTable/V2/Steps/Step1DataShource'
import { DataLoaderQuery, ReferenceData } from '@/interfaces/data_interfaces'
import { JSONStructureDefinition } from '@/Components/DataLoader/SetDataStructure/useJsonStructure'
import { DataTableFieldConfig } from '@/Components/SetupDataTable/ManageDataTableFields'
import { DataSource } from '@/Components/SetupDataTable/DataSourceSelection'
import { DataTableFieldMapping } from '@/Components/DataLoader/useDataTableToJsonMapping'
import Step5DataTableDetail from '@/Components/SetupDataTable/V2/Steps/Step5DataTableDetail'
import { FieldErrors } from '@/Components/SetupDataTable/SetupDataTable'

type DataSourceType = 'sql' | 'api' | 'excel' | null

interface Props {
  types: ReferenceData[]
}

function SetupDataTableV2({ types }: Readonly<Props>) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [dataSource, setDataSource] = useState<DataSourceType>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [fields, setFields] = useState<DataTableFieldConfig[]>([])
  const [selectedSource, setSelectedSource] = useState<DataSource>(null)

  const [selectedQuery, setSelectedQuery] = useState<DataLoaderQuery | null>(null)
  const [selectedAPI, setSelectedAPI] = useState<DataLoaderQuery | null>(null)

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const [sourceResponseStructure, setSourceResponseStructure] =
    useState<JSONStructureDefinition | null>(null)

  useEffect(() => {
    console.log('sourceres :', sourceResponseStructure)
  }, [sourceResponseStructure])

  const sourceName = useMemo(() => {
    switch (selectedSource) {
      case 'api':
        return 'REST API'
      case 'sql':
        return 'SQL Query'
      case 'excel':
        return 'Excel File'
      default:
        return null
    }
  }, [selectedSource])

  const steps = [
    { number: 1, label: 'Data Source' },
    { number: 2, label: 'Query Selection' },
    { number: 3, label: 'Data Preview' },
    { number: 4, label: 'Field Configuration' },
    { number: 5, label: 'Data Table Details & Job Schedule' },
  ]

  const handleDataSourceSelect = (source: DataSourceType) => {
    setDataSource(source)
    setCurrentStep(2)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      if (currentStep === 2) {
        setDataSource(null)
      }
      setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4 | 5)
    }
  }

  const handleContinue = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as 1 | 2 | 3 | 4 | 5)
    }
  }

  const fieldMapping = useMemo(() => {
    return fields
      .filter((field) => field.source_field_path != null)
      .map((field) => {
        return {
          column: field.column,
          field_name: field.field_name,
          field_type: field.type as 'date' | 'dimension' | 'measure' | 'text' | 'relation',
          json_field_path: field.source_field_path,
          date_format:
            field.type === 'date' ? (field.source_field_date_format ?? 'Y-m-d') : undefined,
        } as DataTableFieldMapping
      })
  }, [fields])

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='mb-1 text-3xl font-bold text-gray-900'>Data Connection</h1>
          <p className='text-sm text-gray-500'>Configure your data source and table structure</p>
        </div>

        {/* Progress Steps */}
        <div className='mb-10'>
          <div className='flex items-start justify-between'>
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <Step
                  number={step.number}
                  label={step.label}
                  isActive={step.number === currentStep}
                  isCompleted={step.number < currentStep}
                />
                {index < steps.length - 1 && <div className='mx-2 mt-6 h-px flex-1 bg-gray-300' />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {currentStep === 1 && <Step1DataSource onDataSourceSelect={handleDataSourceSelect} />}

        {currentStep === 2 && dataSource === 'sql' && (
          <Step2QuerySelection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onQuerySelect={setSelectedQuery}
            onBack={handleBack}
            onContinue={handleContinue}
          />
        )}

        {/*{currentStep === 2 && dataSource === 'api' && (*/}
        {/*  <Step2APISelection*/}
        {/*    searchQuery={searchQuery}*/}
        {/*    onSearchChange={setSearchQuery}*/}
        {/*    onBack={handleBack}*/}
        {/*    onContinue={handleContinue}*/}
        {/*  />*/}
        {/*)}*/}

        {/*{currentStep === 2 && dataSource === 'excel' && (*/}
        {/*  <Step2ExcelSelection*/}
        {/*    searchQuery={searchQuery}*/}
        {/*    onSearchChange={setSearchQuery}*/}
        {/*    onBack={handleBack}*/}
        {/*    onContinue={handleContinue}*/}
        {/*  />*/}
        {/*)}*/}

        {currentStep === 3 && dataSource === 'sql' && (
          <Step3QueryPreview
            selectedQuery={selectedQuery}
            setSourceResponseStructure={setSourceResponseStructure}
            onBack={handleBack}
            onContinue={handleContinue}
          />
        )}

        {/*{currentStep === 3 && dataSource === 'api' && (*/}
        {/*  <Step3APIPreview*/}
        {/*    onBack={handleBack}*/}
        {/*    onContinue={handleContinue}*/}
        {/*  />*/}
        {/*)}*/}

        {/*{currentStep === 3 && dataSource === 'excel' && (*/}
        {/*  <Step3ExcelPreview*/}
        {/*    onBack={handleBack}*/}
        {/*    onContinue={handleContinue}*/}
        {/*  />*/}
        {/*)}*/}

        {currentStep === 4 && dataSource === 'sql' && (
          <Step4QueryFieldConfig
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onBack={handleBack}
            onContinue={handleContinue}
            responseStructure={sourceResponseStructure}
            fields={fields}
            setFields={setFields}
          />
        )}

        {currentStep === 5 && (
          <Step5DataTableDetail
            fields={fields}
            types={types}
            fieldMapping={fieldMapping}
            selectedQuery={selectedQuery}
            selectedAPI={selectedAPI}
            onErrorsChange={setFieldErrors}
          />
        )}

        {/*{currentStep === 4 && dataSource === 'api' && (*/}
        {/*  <Step4APIFieldConfig*/}
        {/*    searchQuery={searchQuery}*/}
        {/*    onSearchChange={setSearchQuery}*/}
        {/*    onBack={handleBack}*/}
        {/*    onContinue={handleContinue}*/}
        {/*  />*/}
        {/*)}*/}

        {/*{currentStep === 4 && dataSource === 'excel' && (*/}
        {/*  <Step4ExcelFieldConfig*/}
        {/*    searchQuery={searchQuery}*/}
        {/*    onSearchChange={setSearchQuery}*/}
        {/*    onBack={handleBack}*/}
        {/*    onContinue={handleContinue}*/}
        {/*  />*/}
        {/*)}*/}
      </div>
    </div>
  )
}

export default SetupDataTableV2
