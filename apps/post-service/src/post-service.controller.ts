import { Controller, Get, Inject } from '@nestjs/common';
import { PostServiceService } from './post-service.service';
import { Post } from './entities/post.entity';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { CreatePostDto } from './dtos/create-post.dto';

const posts: Post[] = [
  { id: 1, title: 'My First Post', content: 'Hello World!', authorId: 1 },
  {
    id: 2,
    title: 'NestJS Basics',
    content: 'Learning about NestJS microservices.',
    authorId: 2,
  },
];
let nextPostId = 3;

@Controller()
export class PostServiceController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy, // Inject Client Proxy
  ) {}

  // @Get()
  // getHello(): string {
  //   return this.postServiceService.getHello();
  // }

  @MessagePattern('create_post')
  async createPost(data: CreatePostDto): Promise<Post> {
    console.log('Post Service: Received create_post:', data);
    const newPost: Post = { id: nextPostId++, ...data };
    posts.push(newPost);
    return newPost;
  }

  @MessagePattern('get_all_posts')
  async getAllPosts(): Promise<Post[]> {
    console.log('Post Service: Received get_all_posts');
    const postsWithAuthors: Post[] = [];

    for (const post of posts) {
      // Gọi User Service để lấy thông tin tác giả
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

  @MessagePattern('get_post_by_id')
  async getPostById(postId: number): Promise<Post | undefined> {
    console.log('Post Service: Received get_post_by_id for ID:', postId);
    const post = posts.find((p) => p.id === postId);
    if (!post) {
      return undefined;
    }

    // Gọi User Service để lấy thông tin tác giả
    const user = await lastValueFrom(
      this.userServiceClient.send('get_user_by_id', post.authorId),
    );

    return {
      ...post,
      authorUsername: user ? user.username : 'Unknown',
    };
  }
}
