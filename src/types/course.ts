export interface Module {
    id: string;
    parent_id?: string;
    title: string;
    description: string;
    type: string; // "video" or "chapter"
    video_url: string;
    points: number;
    is_free: boolean;
    order_index: number;
    is_completed: boolean;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnail_url: string;
    teacher_id: string;
    teacher_name: string;
    teacher_avatar_url: string;
    teacher_bio: string;
    student_count: number;
    modules: Module[];
    type: string;
    status: string;
    duration?: string;
    is_certificate_available: boolean;
    start_date?: string;
    progress?: number;
    likes_count: number;
    is_liked: boolean;
}

export interface Enrollment {
    enrolled: boolean;
    status: string;
    progress_percentage: number;
}
