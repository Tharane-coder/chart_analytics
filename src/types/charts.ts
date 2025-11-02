export interface CallDurationDataPoint {
  duration: number
  frequency: number
}

export interface SadPathData {
  category: string
  subcategories: {
    name: string
    value: number
  }[]
  value: number
}

