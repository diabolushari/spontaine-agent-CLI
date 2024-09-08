import { MetaStructure } from '@/interfaces/meta_interfaces'

export interface Model {
  id: number
  created_at?: string | null
  updated_at?: string | null
  created_by?: number | null
  updated_by?: number | null
}

export interface User extends Model {
  name: string
  email: string
  role?: string
}

export interface ReferenceDataDomain extends Model {
  domain: string
}

export interface ReferenceDataParameter extends Model {
  domain_id: number
  parameter: string
}

export interface ReferenceData extends Model {
  domain_id: number
  parameter_id: number
  domain: string
  parameter: string
  sort_order: number
  value_one: string
  value_two: string | null
}

export interface SubjectArea extends Model {
  name: string
  description: string | null
  table_name: string
  is_active: 0 | 1
}

export interface DataDetail extends Model {
  subject_area_id: number
  name: string
  description: string | null
  type: string
  date_fields?: Partial<TableDateField>[]
  dimension_fields?: Partial<TableDimensionField>[]
  measure_fields?: Partial<TableMeasureField>[]
  is_active: 0 | 1
}

export interface TableDateField extends Model {
  data_detail_id: number
  column: string
  field_name: string
}

export interface TableDimensionField extends Model {
  data_detail_id: number
  column: string
  field_name: string
  meta_structure_id: number
  structure?: Partial<MetaStructure>
}

export interface TableMeasureField extends Model {
  data_detail_id: number
  column: string
  unit_column: string | null
  field_name: string
  unit_field_name: string | null
}

export interface DataLoaderConnection extends Model {
  name: string
  description: string | null
  driver: string
  host: string
  port: number
  database: string
  username: string
}

export interface DataLoaderQuery extends Model {
  connection_id: number
  query: string
  name: string
  description: string | null
  connection?: Partial<DataLoaderConnection> | null
}
