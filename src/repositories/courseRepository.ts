import { api } from '../lib/api';
import { Course } from "../models/course";
import type { CourseDTO } from "../types/course";
import type { UserProfileData } from '../types/profile';
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
  async getEnrolments(id: string) {
    const res = await api.get<UserProfileData>(`/users/${id}/enrolments`)
    return res.data
  }
  async getTeachersCourses(id: string) {
    const res = await api.get<CourseDTO[]>(`/courses?teacher_id=${id}`)
    return res.data.map(Course.fromDTO)
  }
}
