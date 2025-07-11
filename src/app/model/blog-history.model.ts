import { Blog } from "./blog.model";

export interface BlogHistory {
  id: string;
  userEmail: string;
  blog: Blog;
  isPaid: Boolean;
}
