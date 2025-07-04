import { Blog } from "./blog.model";

export interface BlogHistory {
  userEmail: string;
  blog: Blog;
  isPaid: Boolean;
}
