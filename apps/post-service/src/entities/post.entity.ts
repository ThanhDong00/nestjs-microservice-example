import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  authorId: number;

  // Thuộc tính này không được lưu trong database, chỉ để hiển thị
  authorUsername?: string; // Sẽ được lấy từ User Service
}
