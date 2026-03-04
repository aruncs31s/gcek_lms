export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  avatar_url?: string;
  bio?: string;
}