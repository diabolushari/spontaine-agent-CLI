import useCustomForm from '@/hooks/useCustomForm'
import useFetchRecord from '@/hooks/useFetchRecord'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Axis, Block, Config } from '@/interfaces/data_interfaces'
import React, { useCallback, useMemo, useState } from 'react'
import ConfigFormStepGeneral from './PageBlockConfigFormComponent/ConfigFromStepGeneral'
import ConfigFormStepTrend from './PageBlockConfigFormComponent/ConfigFormStepTrend'
import ConfigFormStepRanking from './PageBlockConfigFormComponent/ConfigFormStepRanking'

interface BlockFormProps {
  initialData: Config
  onCloseStep?: () => void
  block: Block
}

export default function BlockDrawerForm({ initialData, block }: BlockFormProps) {
  const [step, setStep] = useState(1)
  const [stepData, setStepData] = useState(initialData)

  return (
    <>
      <div className='relative w-full overflow-x-hidden'>
        <div
          className='flex min-h-[400px] transition-transform duration-500 ease-in-out'
          style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
        >
          {/* Step 1 */}
          <div className='w-full shrink-0'>
            {step === 1 && (
              <div className='w-full'>
                <ConfigFormStepGeneral
                  initialData={stepData}
                  block={block}
                  onNext={(validatedData: Partial<Config>) => {
                    setStepData((prev) => ({ ...prev, ...validatedData }))
                    setStep(2)
                  }}
                />
              </div>
            )}
          </div>

          {/* Step 2 */}
          <div className='w-full shrink-0'>
            {step === 2 && (
              <div className='w-full'>
                <ConfigFormStepTrend
                  initialData={stepData}
                  block={block}
                  onBack={() => {
                    setStep(1)
                  }}
                  onNext={(validatedData: Partial<Config>) => {
                    setStepData((prev) => ({ ...prev, ...validatedData }))
                    setStep(3)
                  }}
                />
              </div>
            )}
          </div>

          {/* Step 3  */}
          <div className='w-full shrink-0'>
            {step === 3 && (
              <div className='w-full'>
                <ConfigFormStepRanking
                  initialData={stepData}
                  block={block}
                  onBack={() => {
                    setStep(2)
                  }}
                  onNext={(validatedData: Partial<Config>) => {
                    setStepData((prev) => ({ ...prev, ...validatedData }))
                    setStep(4)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
