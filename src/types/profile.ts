import type { UserDTO } from "./user"
import type { AchievementResponse } from "./achievement"
import type { EnrolmentDTO } from "./enrolments"



export interface UserProfileData {
    user: UserDTO
    points: number;
    achievements: AchievementResponse[];
    enrolments: EnrolmentDTO[];
    total_enrolments: number;
}
