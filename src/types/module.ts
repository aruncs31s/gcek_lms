export interface ModuleDTO {
  id: string
  parent_id?: string
  title: string
  description: string
  type: string
  video_url: string
  points: number
  is_free: boolean
  order_index: number
  is_completed: boolean
}

export class Module {
  id: string
  parentId?: string
  title: string
  description: string
  type: string
  videoUrl: string
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
      dto.points,
      dto.is_free,
      dto.order_index,
      dto.is_completed
    )
  }

  get isVideo(): boolean {
    return this.type === "video"
  }
}
