import { Controller, Get, Inject } from '@nestjs/common';
import { PostServiceService } from './post-service.service';
import { Post } from './entities/post.entity';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

@Controller()
export class PostServiceController {
  constructor(
    @Inject() private readonly postServiceService: PostServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.postServiceService.getHello();
  }

  @MessagePattern('create_post')
  async createPost(data: CreatePostDto): Promise<Post> {
    const newPost: Post = await this.postServiceService.createPost(data);
    return newPost;
  }

  @MessagePattern('get_all_posts')
  async getAllPosts(): Promise<Post[]> {
    const posts: Post[] = await this.postServiceService.getAllPosts();
    return posts;
  }

  @MessagePattern('get_post_by_id')
  async getPostById(postId: number): Promise<Post | undefined> {
    const post = await this.postServiceService.getPostById(postId);
    return post;
  }

  @MessagePattern('update_post')
  async updatePost(data: {
    postId: number;
    updateData: UpdatePostDto;
  }): Promise<Post | undefined> {
    const updatedPost = await this.postServiceService.updatePost(data);
    return updatedPost;
  }

  @MessagePattern('delete_post')
  async deletePost(postId: number): Promise<{ success: boolean; message: string }> {
    const result = await this.postServiceService.deletePost(postId);
    return result;
  }
}
