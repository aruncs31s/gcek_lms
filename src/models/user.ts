import type { UserDTO } from "../types/user"
import userAvatarDefault from '../assets/user_avatar.png';
import type { BadgeStyle } from "../types/user";

const Role = {
    ADMIN: "admin",
    TEACHER: "teacher",
    STUDENT: "student"
}

export type Role = typeof Role[keyof typeof Role]

export class User {
    id: string
    firstName: string
    lastName: string
    email: string
    role: Role
    avatarUrl: string
    bio: string
    enrolledCourses?: number
    points?: number

    private constructor(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        role: Role,
        avatarUrl: string,
        bio: string
    ) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.role = role
        this.avatarUrl = avatarUrl
        this.bio = bio
    }

    static fromDTO(dto: UserDTO): User {
        return new User(
            dto.id,
            dto.first_name,
            dto.last_name,
            dto.email,
            dto.role as Role,
            dto.avatar_url ?? "",
            dto.bio ?? ""
        )

    }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`
    }

    get avatar(): string {
        if (this.avatarUrl && this.avatarUrl.trim() !== '') {
            return this.avatarUrl;
        }
        return userAvatarDefault;
    }

    get badgeStyle(): BadgeStyle {
        switch (this.role) {
            case "admin":
                return {
                    background: "rgba(243, 139, 168, 0.15)",
                    color: "var(--danger)",
                    border: "1px solid rgba(243, 139, 168, 0.3)"
                }

            case "teacher":
                return {
                    background: "rgba(203, 166, 247, 0.15)",
                    color: "var(--brand-primary)",
                    border: "1px solid rgba(203, 166, 247, 0.3)"
                }

            default:
                return {
                    background: "rgba(166, 227, 161, 0.15)",
                    color: "var(--success)",
                    border: "1px solid rgba(166, 227, 161, 0.3)"
                }
        }

    }
    get totalPoints(): number {
        return this.points ?? 0;
    }

    isAdmin(): boolean {
        return this.role === "admin"
    }
}
