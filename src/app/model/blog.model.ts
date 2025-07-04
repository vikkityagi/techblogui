export interface Blog {
  id?: number;
  title: string;
  content: string;
  titleNumber: string; // Optional field for blog title number
  createdAt?: string;
  userEmail: string; // Email of the user who created the blog
  date?: string; // Date in YYYY-MM-DD format
  isPaid?: boolean; // Optional field to indicate if the blog is paid
}