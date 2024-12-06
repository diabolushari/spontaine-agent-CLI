import { OfficeData } from '@/Pages/DataExplorer/DataExplorer'
import { useMemo } from 'react'

export default function useOfficeLevelSelection(
  officeLevel: string,
  region?: OfficeData | null,
  circle?: OfficeData | null,
  division?: OfficeData | null,
  subdivision?: OfficeData | null
) {
  const selectedOffice = useMemo(() => {
    switch (officeLevel) {
      case 'region':
        return region
      case 'circle':
        return circle
      case 'division':
        return division
      case 'subdivision':
        return subdivision
      default:
        return null
    }
  }, [officeLevel, region, subdivision, circle, division])

  const prevLevelOffice = useMemo(() => {
    switch (officeLevel) {
      case 'subdivision':
        return division || circle || region
      case 'section':
        return subdivision || division || circle || region
      case 'division':
        return circle || region
      case 'circle':
        return region
    }
  }, [officeLevel, region, subdivision, circle, division])

  return {
    selectedOffice,
    prevLevelOffice,
  }
}
