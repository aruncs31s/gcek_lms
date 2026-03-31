import type { ModuleDTO } from './module'


export interface CourseDTO {
  id: string
  title: string
  description: string
  price: number
  thumbnail_url: string
  teacher_id: string
  teacher_name: string
  teacher_avatar_url: string
  teacher_bio: string
  student_count: number
  modules: ModuleDTO[]
  type: string
  status: string
  duration?: string
  is_certificate_available: boolean
  start_date?: string
  progress?: number
  likes_count: number
  is_liked: boolean
}
