import { SubsetDetail, SubsetGroup, SubsetGroupItem } from '@/interfaces/data_interfaces'
import { useMemo, useState } from 'react'
import DashboardLayout from '@/Layouts/DashboardLayout'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import {
  initSelectedSubset,
  OfficeData,
  SelectedOfficeContext,
} from '@/Pages/DataExplorer/DataExplorer'
import DashboardPadding from '@/Layouts/DashboardPadding'
import SelectList from '@/ui/form/SelectList'
import Card from '@/ui/Card/Card'
import OfficeLevelTabs from '@/Components/DataExplorer/OfficeLevelTabs'
import OfficeRanking from '@/Components/DataExplorer/OfficeRanking'

interface Props {
  subsetGroup: SubsetGroup
  subsetItems: SubsetGroupItem[]
  oldTab: string
  oldSubsetName: string | null
  oldFilters: Record<string, string>
  oldRoute?: string
}

export default function OfficeRankingPage({
  subsetGroup,
  subsetItems,
  oldTab,
  oldSubsetName,
  oldRoute,
}: Readonly<Props>) {
  const breadCrumb: BreadcrumbItemLink[] = useMemo(() => {
    return [
      {
        item: 'Home',
        link: oldRoute ?? route('service-delivery.index'),
      },
      {
        item: subsetGroup.name,
        link: '',
      },
    ]
  }, [oldRoute, subsetGroup.name])

  const [sectionCode, setSectionCode] = useState('')
  const [levelName, setLevelName] = useState('')
  const [levelCode, setLevelCode] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<OfficeData | null>(null)
  const [selectedCircle, setSelectedCircle] = useState<OfficeData | null>(null)
  const [selectedDivision, setSelectedDivision] = useState<OfficeData | null>(null)
  const [selectedSubdivision, setSelectedSubdivision] = useState<OfficeData | null>(null)

  const [selectedSubsetId, setSelectedSubsetId] = useState(
    initSelectedSubset(subsetItems, oldSubsetName)
  )

  const [activeTab, setActiveTab] = useState(oldTab)

  const selectedSubset = useMemo(() => {
    if (selectedSubsetId === '') {
      return null
    }
    return subsetItems.find((subsetItem) => subsetItem.id.toString() == selectedSubsetId)
      ?.subset as SubsetDetail | null | undefined
  }, [subsetItems, selectedSubsetId])

  return (
    <DashboardLayout
      type={subsetGroup.name}
      sectionCode={sectionCode}
      setSectionCode={setSectionCode}
      levelName={levelName}
      setLevelName={setLevelName}
      levelCode={levelCode}
      setLevelCode={setLevelCode}
      breadCrumbs={breadCrumb}
    >
      <DashboardPadding>
        <div className='flex w-full flex-col gap-5 pl-12 pt-8 sm:pt-24'>
          <div className='grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
            <div className='flex flex-col'>
              <SelectList
                list={subsetItems}
                dataKey='id'
                displayKey='name'
                setValue={setSelectedSubsetId}
                value={selectedSubsetId}
                showAllOption
                label='Select An Analysis Set'
                allOptionText='Select Subset'
              />
            </div>
          </div>
          <Card className='p-2'>
            <OfficeLevelTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <SelectedOfficeContext.Provider
              value={{
                region: selectedRegion,
                setRegion: setSelectedRegion,
                circle: selectedCircle,
                setCircle: setSelectedCircle,
                division: selectedDivision,
                setDivision: setSelectedDivision,
                subdivision: selectedSubdivision,
                setSubdivision: setSelectedSubdivision,
              }}
            >
              {selectedSubset != null && (
                <OfficeRanking
                  subset={selectedSubset}
                  officeLevel={activeTab}
                />
              )}
            </SelectedOfficeContext.Provider>
          </Card>
        </div>
      </DashboardPadding>
    </DashboardLayout>
  )
}
