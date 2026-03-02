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
    teacher_id?: string;
    teacher_name?: string;
    teacher_avatar_url?: string;
    teacher_bio?: string;
    student_count?: number;
    modules?: Module[];
    type: string;
    format?: string;
    status: string;
    duration?: string;
    start_date?: string;
    progress?: number;
    likes_count?: number;
    is_liked?: boolean;
    created_at?: string;
}

export interface Enrollment {
    enrolled: boolean;
    status: string;
    progress_percentage: number;
}
