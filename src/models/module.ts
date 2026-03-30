import type { ModuleDTO } from "../types/module";

export class Module {
    id: string
    parentId?: string
    title: string
    description: string
    type: string
    videoUrl: string
    pdfUrl: string
    points: number
    isFree: boolean
    orderIndex: number
    isCompleted: boolean

    private constructor(
        id: string,
        parentId: string | undefined,
        title: string,
        description: string,
        type: string,
        videoUrl: string,
        pdfUrl: string,
        points: number,
        isFree: boolean,
        orderIndex: number,
        isCompleted: boolean
    ) {
        this.id = id
        this.parentId = parentId
        this.title = title
        this.description = description
        this.type = type
        this.videoUrl = videoUrl
        this.pdfUrl = pdfUrl
        this.points = points
        this.isFree = isFree
        this.orderIndex = orderIndex
        this.isCompleted = isCompleted
    }

    static fromDTO(dto: ModuleDTO): Module {
        return new Module(
            dto.id,
            dto.parent_id,
            dto.title,
            dto.description,
            dto.type,
            dto.video_url,
            dto.pdf_url || '',
            dto.points,
            dto.is_free,
            dto.order_index,
            dto.is_completed
        )
    }

    get isVideo(): boolean {
        return this.type === 'video'
    }

    get isPdf(): boolean {
        return this.type === 'pdf'
    }
}
