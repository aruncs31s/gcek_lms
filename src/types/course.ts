import { Module } from './module'
import type { ModuleDTO } from './module'
import defaultLogo from '../../public/default_course_logo.png';

export type { Module };


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

export class Course {
  id: string
  title: string
  description: string
  price: number
  thumbnailUrl: string
  teacherId: string
  teacherName: string
  teacherAvatarUrl: string
  teacherBio: string
  studentCount: number
  modules: Module[]
  type: string
  status: string
  duration?: string
  certificateAvailable: boolean
  startDate?: string
  progress?: number
  likesCount: number
  isLiked: boolean

  private constructor(
    id: string,
    title: string,
    description: string,
    price: number,
    thumbnailUrl: string,
    teacherId: string,
    teacherName: string,
    teacherAvatarUrl: string,
    teacherBio: string,
    studentCount: number,
    modules: Module[],
    type: string,
    status: string,
    duration: string | undefined,
    certificateAvailable: boolean,
    startDate: string | undefined,
    progress: number | undefined,
    likesCount: number,
    isLiked: boolean
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.price = price
    this.thumbnailUrl = thumbnailUrl
    this.teacherId = teacherId
    this.teacherName = teacherName
    this.teacherAvatarUrl = teacherAvatarUrl
    this.teacherBio = teacherBio
    this.studentCount = studentCount
    this.modules = modules
    this.type = type
    this.status = status
    this.duration = duration
    this.certificateAvailable = certificateAvailable
    this.startDate = startDate
    this.progress = progress
    this.likesCount = likesCount
    this.isLiked = isLiked
  }

  static fromDTO(dto: CourseDTO): Course {
    return new Course(
      dto.id,
      dto.title,
      dto.description,
      dto.price,
      dto.thumbnail_url,
      dto.teacher_id,
      dto.teacher_name,
      dto.teacher_avatar_url,
      dto.teacher_bio,
      dto.student_count,
      dto.modules?.map(Module.fromDTO) || [],
      dto.type,
      dto.status,
      dto.duration,
      dto.is_certificate_available,
      dto.start_date,
      dto.progress,
      dto.likes_count,
      dto.is_liked
    )
  }
    get thumbnail(): string {
      if (this.thumbnailUrl) {
        return this.thumbnailUrl;
      }
      return defaultLogo;
    }

  get isFree(): boolean {
    return this.price === 0
  }

  get moduleCount(): number {
    return this.modules.length
  }

  get completedModules(): number {
    return this.modules.filter(m => m.isCompleted).length
  }
  
}