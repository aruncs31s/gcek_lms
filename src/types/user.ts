

export type BadgeStyle = {
  background: string
  color: string
  border: string
}

export interface UserDTO {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  avatar_url?: string
  bio?: string
}

// export interface User {
//   id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   role: string;
//   avatar_url?: string;
//   bio?: string;
// }
// export interface LeaderboardUser {
//     user_id: string;
//     first_name: string;
//     last_name: string;
//     avatar_url: string;
//     points: number;
//     enrolled_courses: number;
// }

