export interface CreatePostType {
  category: string;
  title: string;
  description: string;
  image?: string;
}
export interface UpdatePostRepository {
  category: string;
  title: string;
  description: string;
  image: string;
}
