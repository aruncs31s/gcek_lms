import { api } from '../lib/api';
import { Course } from "../types/course";
import type { CourseDTO } from "../types/course";

export class CourseRepository {

  async getCourses(): Promise<Course[]> {
    const res = await api.get<CourseDTO[]>("/courses")
    return res.data.map(Course.fromDTO)
  }

  async getCourse(id: string): Promise<Course> {
    const res = await api.get<CourseDTO>(`/courses/${id}`)
    return Course.fromDTO(res.data)
  }
  async getTrendingCourses(): Promise<Course[]> {
    const res = await api.get<CourseDTO[]>("/courses/trending")
    return res.data.map(Course.fromDTO)
  }

}