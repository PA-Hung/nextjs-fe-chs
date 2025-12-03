export interface BlogTravelPost {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage: string;
  content: string;
  imagesContent: string[];
  status: "draft" | "published" | "archived" | string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogTravelResponse {
  statusCode: number;
  message: string;
  data: BlogTravelPost;
}
