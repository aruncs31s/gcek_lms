import { Module } from './module'
import type { CourseDTO } from '../types/course'
import defaultLogo from '../assets/default_course_logo.png';
import { type EnrolmentDTO } from '../types/enrolments';
export class Course {
    id: string
    title: string
    description?: string
    price?: number
    thumbnailUrl?: string
    teacherId?: string
    teacherName?: string
    teacherAvatarUrl?: string
    teacherBio?: string
    studentCount?: number
    modules?: Module[]
    type?: string
    status?: string
    duration?: string
    certificateAvailable?: boolean
    startDate?: string
    progress?: number
    likesCount?: number
    isLiked?: boolean

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

    static fromEnrolmentDTO(dto: EnrolmentDTO): Course {
        return new Course(
            dto.course_id,                  // id
            dto.course_title,               // title
            "",                             // description (default)
            0,                              // price (default)
            dto.course_thumbnail_url,       // thumbnailUrl
            "",                             // teacherId (default)
            "",                             // teacherName (default)
            "",                             // teacherAvatarUrl (default)
            "",                             // teacherBio (default)
            0,                              // studentCount (default)
            [],                             // modules (default empty array)
            "",                             // type (default)
            dto.status,                     // status
            undefined,                      // duration
            false,                          // certificateAvailable (default)
            dto.enrolled_at,      // startDate (using enrolled_at)
            dto.progress_percentage,        // progress
            0,                              // likesCount (default)
            false                           // isLiked (default)
        );
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
        return this.modules?.length || 0
    }

    get completedModules(): number {
        return this.modules?.filter(m => m.isCompleted).length || 0
    }

}