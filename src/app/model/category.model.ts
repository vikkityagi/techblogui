export interface Category {
  id?: string; // optional because it's not required when creating a new category
  name: string;
  description: string;
  imageBase64: string; // holds the base64 encoded image string
}
