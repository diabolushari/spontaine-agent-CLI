import { Model } from './data_interfaces'

export interface OfficeStructure {
  region_code: string
  region_name: string
  isOpen: boolean
  displayAll: boolean
  circles: {
    circle_name: string
    circle_code: string
    isOpen: boolean
    displayAll: boolean
    divisions: {
      division_code: string
      division_name: string
      isOpen: boolean
      displayAll: boolean
      subdivisions: {
        subdivision_code: string
        subdivision_name: string
        displayAll: boolean
        isOpen: boolean
        sections: { section_code: string; section_name: string }[]
      }[]
    }[]
  }[]
}

export interface OfficeInfo extends Model {
  circle_code?: string
  circle_id?: string
  circle_name?: string
  data_date?: string
  division_code?: string
  division_id?: string
  division_name?: string
  region_code?: string
  region_id?: string
  region_name?: string
  section_code?: string
  section_id?: string
  section_name?: string
  subdivision_code?: string
  subdivision_id?: string
  subdivision_name?: string
  level_name?: string
}

export const findCircles = (regionCode: string, officesInCircle: OfficeInfo[]) => {
  const circles: {
    circle_code: string
    circle_name: string
    isOpen: boolean
    displayAll: boolean
    divisions: {
      division_code: string
      division_name: string
      isOpen: boolean
      displayAll: boolean
      subdivisions: {
        subdivision_code: string
        subdivision_name: string
        isOpen: boolean
        displayAll: boolean
        sections: { section_code: string; section_name: string }[]
      }[]
    }[]
  }[] = []
  officesInCircle.forEach((office) => {
    if (office.region_code != regionCode) return
    const ifExists = circles.find((circle) => circle.circle_code === office.circle_code)
    if (ifExists == null) {
      circles.push({
        circle_code: office.circle_code ?? '',
        circle_name: office.circle_name ?? '',
        isOpen: false,
        displayAll: true,
        divisions: findDivisions(office.circle_code ?? '', officesInCircle),
      })
    }
  })
  return circles
}

export const findDivisions = (circleCode: string, officesInCircle: OfficeInfo[]) => {
  const divisions: {
    division_code: string
    division_name: string
    isOpen: boolean
    displayAll: boolean
    subdivisions: {
      subdivision_code: string
      subdivision_name: string
      isOpen: boolean
      displayAll: boolean
      sections: { section_code: string; section_name: string }[]
    }[]
  }[] = []
  officesInCircle.forEach((office) => {
    if (office.circle_code != circleCode) return
    const ifExists = divisions.find((division) => division.division_code === office.division_code)
    if (ifExists == null) {
      divisions.push({
        division_code: office.division_code ?? '',
        division_name: office.division_name ?? '',
        isOpen: false,
        displayAll: true,
        subdivisions: findSubdivisions(office.division_code ?? '', officesInCircle),
      })
    }
  })
  return divisions
}

export const findSubdivisions = (divisionCode: string, officesInCircle: OfficeInfo[]) => {
  const subdivisions: {
    subdivision_code: string
    subdivision_name: string
    isOpen: boolean
    displayAll: boolean
    sections: { section_code: string; section_name: string }[]
  }[] = []

  officesInCircle.forEach((office) => {
    if (office.division_code != divisionCode) return
    const ifExists = subdivisions.find(
      (subdivision) => subdivision.subdivision_code === office.subdivision_code
    )
    if (ifExists == null) {
      subdivisions.push({
        subdivision_code: office.subdivision_code ?? '',
        subdivision_name: office.subdivision_name ?? '',
        isOpen: false,
        displayAll: true,
        sections: findSections(office.subdivision_code ?? '', officesInCircle),
      })
    }
  })

  return subdivisions
}

export const findSections = (subdivisionCode: string, officesInCircle: OfficeInfo[]) => {
  const sections: { section_code: string; section_name: string }[] = []

  officesInCircle.forEach((office) => {
    if (office.subdivision_code === subdivisionCode) {
      const ifExists = sections.find((section) => section.section_code === office.section_code)
      if (ifExists == null) {
        sections.push({
          section_code: office.section_code ?? '',
          section_name: office.section_name ?? '',
        })
      }
    }
  })

  return sections
}
export const displayName = (level: { level: string; record: OfficeInfo } | null) => {
  if (level?.level === 'region') return level.record.region_name
  if (level?.level === 'circle') return level.record.circle_name
  if (level?.level === 'division') return level?.record.division_name
  if (level?.level === 'subdivision') return level?.record.subdivision_name
  if (level?.level === 'section') return level?.record.section_name
}
