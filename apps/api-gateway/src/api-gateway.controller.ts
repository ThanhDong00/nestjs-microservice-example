import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('POST_SERVICE') private readonly postServiceClient: ClientProxy,
  ) {}

  // --- Users Endpoints ---
  @Post('users')
  async createUser(@Body() data: { username: string; email: string }) {
    return await lastValueFrom(
      this.userServiceClient.send('create_user', data),
    );
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return { error: 'Invalid user ID' };
    }

    return await lastValueFrom(
      this.userServiceClient.send('get_user_by_id', userId),
    );
  }

  // --- Post Endpoints ---
  @Post('posts')
  async createPost(
    @Body() data: { title: string; content: string; authorId: number },
  ) {
    // Gửi tin nhắn đến Post Service
    return await lastValueFrom(
      this.postServiceClient.send('create_post', data),
    );
  }

  @Get('posts')
  async getAllPosts() {
    // Gửi tin nhắn đến Post Service
    return await lastValueFrom(
      this.postServiceClient.send('get_all_posts', {}), // Payload trống nếu không cần dữ liệu cụ thể
    );
  }

  @Get('posts/:id')
  async getPostById(@Param('id') id: string) {
    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
      return { error: 'Invalid post ID' };
    }
    // Gửi tin nhắn đến Post Service
    return await lastValueFrom(
      this.postServiceClient.send('get_post_by_id', postId),
    );
  }

  @Put('posts/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() data: { title: string; content: string; authorId: number },
  ) {
    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
      return { error: 'Invalid post ID' };
    }
    // Gửi tin nhắn đến Post Service
    return await lastValueFrom(
      this.postServiceClient.send('update_post', {
        postId,
        updateData: data,
      }),
    );
  }

  @Delete('posts/:id')
  async deletePost(@Param('id') id: string) {
    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
      return { error: 'Invalid post ID' };
    }
    // Gửi tin nhắn đến Post Service
    return await lastValueFrom(
      this.postServiceClient.send('delete_post', postId),
    );
  }
}
