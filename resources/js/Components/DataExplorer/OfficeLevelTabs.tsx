import handleEnterPress from '@/libs/handle-enter'
import Dropdown from '@/ui/button/DropDown'
import { useMemo } from 'react'

interface Props {
  activeTab: string
  setActiveTab: (tab: string) => void
  showState?: boolean
}

const tabItems = [
  { name: 'State', value: 'state' },
  { name: 'Regions', value: 'region' },
  { name: 'Circles', value: 'circle' },
  { name: 'Divisions', value: 'division' },
  { name: 'Sub Divisions', value: 'subdivision' },
  { name: 'Sections', value: 'section' },
]

export function getNextOfficeLevel(currentLevel: string) {
  const index = tabItems.findIndex((tab) => tab.value === currentLevel)
  return tabItems[index + 1]?.value || 'state'
}

export default function OfficeLevelTabs({ activeTab, setActiveTab, showState = true }: Props) {
  const tabs = useMemo(() => {
    if (showState) {
      return tabItems
    }
    return tabItems.filter((tab) => tab.value !== 'state')
  }, [showState])

  return (
    <div
      className='w-full border-b border-1stop-alt-gray'
      role='tablist'
    >
      <div className='hidden w-full lg:flex'>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`relative px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? 'text-1stop-highlight'
                : 'text-1stop-dark-gray hover:text-1stop-highlight'
            }`}
            onClick={() => setActiveTab(tab.value)}
            tabIndex={0}
            role='tab'
            onKeyDown={(event) => handleEnterPress(event, () => setActiveTab(tab.value))}
          >
            {tab.name}
            {activeTab === tab.value && (
              <div className='absolute bottom-0 left-0 h-0.5 w-full bg-1stop-highlight'></div>
            )}
          </button>
        ))}
      </div>
      <div className='flex w-full flex-col px-1 pb-2 md:px-2 md:pb-2 lg:hidden lg:px-0 lg:pb-0'>
        <Dropdown
          list={tabItems}
          dataKey='value'
          displayKey='name'
          value={activeTab}
          setValue={setActiveTab}
        />
      </div>
    </div>
  )
}
