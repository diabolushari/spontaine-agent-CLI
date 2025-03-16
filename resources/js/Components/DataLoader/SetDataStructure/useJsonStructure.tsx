import { useCallback, useState } from 'react'
import {
  JSONDefinition,
  JSONFieldType,
} from '@/Components/DataLoader/SetDataStructure/SetDataStructure'

export interface JSONStructureDefinition {
  last_uuid: number
  definition: JSONDefinition
}

function partialUpdate(
  definition: JSONDefinition,
  idToUpdate: number,
  updateValue: Partial<JSONDefinition>
): JSONDefinition {
  if (definition.id === idToUpdate) {
    return {
      ...definition,
      ...updateValue,
    }
  }
  return {
    ...definition,
    children: definition.children.map((child) => {
      return partialUpdate(child, idToUpdate, updateValue)
    }),
  }
}

function insertNewChild(
  definition: JSONDefinition,
  idToUpdate: number,
  newItemId: number
): JSONDefinition {
  if (definition.id === idToUpdate) {
    return {
      ...definition,
      children: [
        ...definition.children,
        {
          id: newItemId,
          field_name: '',
          field_type: 'primitive',
          children: [],
        },
      ],
    }
  }
  return {
    ...definition,
    children: definition.children.map((child) => {
      return insertNewChild(child, idToUpdate, newItemId)
    }),
  }
}

function removeItem(definition: JSONDefinition, idToRemove: number): JSONDefinition {
  const childIndex = definition.children.findIndex((child) => child.id === idToRemove)
  if (childIndex !== -1) {
    return {
      ...definition,
      children: [...definition.children.toSpliced(childIndex, 1)],
    }
  }
  return {
    ...definition,
    children: definition.children.map((child) => {
      return removeItem(child, idToRemove)
    }),
  }
}

export default function useJsonStructure(initialStructure: JSONStructureDefinition) {
  const [dataStructure, setDataStructure] = useState<JSONStructureDefinition>({
    ...initialStructure,
  })

  const updateJsonFieldName = useCallback((fieldId: number, fieldName: string) => {
    setDataStructure((oldStructure) => {
      return {
        ...oldStructure,
        definition: partialUpdate(oldStructure.definition, fieldId, { field_name: fieldName }),
      }
    })
  }, [])

  const updateJsonFieldType = useCallback((fieldId: number, type: JSONFieldType) => {
    const partialData: Partial<JSONDefinition> = {
      field_type: type,
    }

    if (type === 'primitive-array' || type === 'primitive') {
      partialData['children'] = []
    }

    setDataStructure((oldValue) => {
      return {
        ...oldValue,
        definition: partialUpdate(oldValue.definition, fieldId, partialData),
      }
    })
  }, [])

  const addNewFieldToJson = useCallback((parentFieldId: number) => {
    setDataStructure((oldValue) => {
      return {
        ...oldValue,
        last_uuid: oldValue.last_uuid + 1,
        definition: insertNewChild(oldValue.definition, parentFieldId, oldValue.last_uuid + 1),
      }
    })
  }, [])

  const removeFieldFromJson = useCallback((fieldIdToBeDeleted: number) => {
    setDataStructure((oldValue) => {
      return {
        ...oldValue,
        definition: removeItem(oldValue.definition, fieldIdToBeDeleted),
      }
    })
  }, [])

  return {
    dataStructure,
    updateJsonFieldName,
    updateJsonFieldType,
    addNewFieldToJson,
    removeFieldFromJson,
  }
}
