import React, { useEffect, useState } from 'react'
import { OfficeStructure } from './DashboardLayout'
import RegionLevel from '@/Components/LayoutAccordions/RegionLevel'
import CircleLevel from '@/Components/LayoutAccordions/CircleLevel'
import DivisionLevel from '@/Components/LayoutAccordions/DivisionLevel'
import SectionLevel from '@/Components/LayoutAccordions/SectionLevel'
import SubdivisionLevel from '@/Components/LayoutAccordions/SubdivisionLevel'

import useFetchRecord from '@/hooks/useFetchRecord'

interface Properties {
  officeStructures: OfficeStructure[] | undefined
  setLevel: React.Dispatch<React.SetStateAction<string>>
  level: string
  setLevelCode: React.Dispatch<React.SetStateAction<string>>
  setLevelType: React.Dispatch<React.SetStateAction<string>>
  setLevelTypeName: React.Dispatch<React.SetStateAction<string>>
}
interface LevelType {
  level: string
  record: string
}
const DropdownAccordion = ({
  officeStructures,
  setLevel,
  setLevelCode,
  setLevelType,
  setLevelTypeName,
}: Properties) => {
  const setLevelAndCode = (
    level: string,
    levelCode: string,
    levelType: string,
    levelTypeName: string
  ) => {
    setLevel(level ?? '')
    setLevelCode(levelCode ?? '')
    setLevelType(levelType ?? '')
    setLevelTypeName(levelTypeName ?? '')
    setTimeout(() => setAccordionOpen(!accordionOpen), 500)
  }

  const [levelType] = useFetchRecord<LevelType>('find-level')
  const [office, setOffice] = useState(officeStructures)
  useEffect(() => {
    setOffice(officeStructures)
  }, [officeStructures])

  const [accordionOpen, setAccordionOpen] = useState(false)

  const onAccortdionClick = (
    regionCode?: string,
    circleCode?: string | null,
    divisionCode?: string | null,
    subDivisionCode?: string | null
  ) => {
    setOffice((prevState) => {
      return prevState?.map((region) => {
        if (region.region_code === regionCode) {
          return {
            ...region,
            isOpen: true,
            circles: region.circles.map((circle) => {
              if (circle.circle_code === circleCode) {
                return {
                  ...circle,
                  isOpen: true,
                  divisions: circle.divisions.map((division) => {
                    if (division.division_code === divisionCode) {
                      return {
                        ...division,
                        isOpen: true,
                        subdivisions: division.subdivisions.map((subdivision) => {
                          if (subdivision.subdivision_code === subDivisionCode) {
                            return {
                              ...subdivision,
                              isOpen: true,
                              sections: subdivision.sections.map((section) => {
                                return {
                                  ...section,
                                }
                              }),
                            }
                          }
                          return { ...subdivision, isOpen: false }
                        }),
                      }
                    }
                    return { ...division, isOpen: false }
                  }),
                }
              }
              return {
                ...circle,
                isOpen: false,
              }
            }),
          }
        }
        return {
          ...region,
          isOpen: false,
        }
      })
    })

    setOffice((prevState) => {
      return prevState?.map((region) => {
        if (region.region_code === regionCode) {
          return {
            ...region,

            circles: region?.circles.map((circle) => {
              if (circle.circle_code === circleCode) {
                return {
                  ...circle,

                  divisions: circle.divisions.map((division) => {
                    if (division.division_code === divisionCode) {
                      return {
                        ...division,

                        subdivisions: division.subdivisions.map((subdivision) => {
                          if (subdivision.subdivision_code === subDivisionCode) {
                            return {
                              ...subdivision,

                              sections: subdivision.sections.map((section) => {
                                return {
                                  ...section,
                                }
                              }),
                              displayAll: true,
                            }
                          }
                          return { ...subdivision }
                        }),
                        displayAll: division.subdivisions.every(
                          (subdivision) => !subdivision.isOpen
                        ),
                      }
                    }
                    return { ...division, isOpen: false }
                  }),
                  displayAll: circle.divisions.every((division) => !division.isOpen),
                }
              }
              return {
                ...circle,
                isOpen: false,
              }
            }),
            displayAll: region.circles.every((circle) => !circle.isOpen),
          }
        }
        return {
          ...region,
          isOpen: false,
        }
      })
    })
  }

  return (
    <div className='min-w-80'>
      {levelType?.level === 'region' && (
        <RegionLevel
          office={office}
          onAccortdionClick={onAccortdionClick}
          accordionOpen={accordionOpen}
          setAccordionOpen={setAccordionOpen}
          setLevelAndCode={setLevelAndCode}
        />
      )}
      {levelType?.level === 'circle' && (
        <CircleLevel
          office={office}
          onAccortdionClick={onAccortdionClick}
          accordionOpen={accordionOpen}
          setAccordionOpen={setAccordionOpen}
          setLevelAndCode={setLevelAndCode}
        />
      )}

      {levelType?.level === 'division' && (
        <DivisionLevel
          office={office}
          onAccortdionClick={onAccortdionClick}
          accordionOpen={accordionOpen}
          setAccordionOpen={setAccordionOpen}
          setLevelAndCode={setLevelAndCode}
        />
      )}

      {levelType?.level === 'subdivision' && (
        <SubdivisionLevel
          office={office}
          onAccortdionClick={onAccortdionClick}
          accordionOpen={accordionOpen}
          setAccordionOpen={setAccordionOpen}
          setLevelAndCode={setLevelAndCode}
        />
      )}
      {levelType?.level === 'section' && (
        <SectionLevel
          office={office}
          onAccortdionClick={onAccortdionClick}
          accordionOpen={accordionOpen}
          setAccordionOpen={setAccordionOpen}
          setLevelAndCode={setLevelAndCode}
        />
      )}
    </div>
  )
}

export default DropdownAccordion
