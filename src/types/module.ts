export interface ModuleDTO {
  id: string
  parent_id?: string
  title: string
  description: string
  type: string
  video_url: string
  pdf_url: string
  points: number
  is_free: boolean
  order_index: number
  is_completed: boolean
}
