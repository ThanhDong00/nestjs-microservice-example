import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UpdatePostDto } from './dtos/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostServiceService implements OnModuleInit {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createPost(data: CreatePostDto): Promise<Post> {
    console.log('Post Service: Received create_post:', data);
    const newPost = this.postRepository.create(data);
    return await this.postRepository.save(newPost);
  }

  async getAllPosts(): Promise<Post[]> {
    console.log('Post Service: Received get_all_posts');
    const posts = await this.postRepository.find();
    const postsWithAuthors: Post[] = [];

    for (const post of posts) {
      const user = await lastValueFrom(
        this.userServiceClient.send('get_user_by_id', post.authorId),
      );
      postsWithAuthors.push({
        ...post,
        authorUsername: user ? user.username : 'Unknown',
      });
    }

    return postsWithAuthors;
  }

  async getPostById(postId: number): Promise<Post | undefined> {
    console.log('Post Service: Received get_post_by_id for ID:', postId);

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      return undefined;
    }

    const user = await lastValueFrom(
      this.userServiceClient.send('get_user_by_id', post.authorId),
    );

    return {
      ...post,
      authorUsername: user ? user.username : 'Unknown',
    };
  }

  async updatePost(data: {
    postId: number;
    updateData: UpdatePostDto;
  }): Promise<Post | undefined> {
    console.log('Post Service: Update post by Id');

    const post = await this.postRepository.findOne({ where: { id: data.postId } });

    if (!post) {
      throw new RpcException('Post not found');
    }

    // Cập nhật post với dữ liệu mới
    Object.assign(post, data.updateData);
    return await this.postRepository.save(post);
  }

  async deletePost(postId: number): Promise<{ success: boolean; message: string }> {
    console.log('Post Service: Delete post by Id:', postId);

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      return { success: false, message: 'Post not found' };
    }

    await this.postRepository.remove(post);
    return { success: true, message: 'Post deleted successfully' };
  }

  async onModuleInit() {
    // Seed dữ liệu mẫu nếu database trống
    const count = await this.postRepository.count();
    if (count === 0) {
      const samplePosts = [
        { title: 'My First Post', content: 'Hello World!', authorId: 1 },
        {
          title: 'NestJS Basics',
          content: 'Learning about NestJS microservices.',
          authorId: 2,
        },
      ];
      
      for (const postData of samplePosts) {
        const post = this.postRepository.create(postData);
        await this.postRepository.save(post);
      }
      
      console.log('Seeded sample posts data');
    }
  }
}
