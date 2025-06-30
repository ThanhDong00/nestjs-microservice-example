export class Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorUsername?: string; // Sẽ được lấy từ User Service
}
