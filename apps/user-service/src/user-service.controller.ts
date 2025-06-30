import { Controller, Get } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { User } from './entities/user.entity';
import { MessagePattern } from '@nestjs/microservices';

const users: User[] = [
  { id: 1, username: 'john_doe', email: 'john@example.com' },
  { id: 2, username: 'jane_smith', email: 'jane@example.com' },
];
let nextId = 3;

@Controller()
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  // @Get()
  // getHello(): string {
  //   return this.userServiceService.getHello();
  // }

  @MessagePattern('create_user')
  createUser(data: { username: string; email: string }): User {
    console.log('User Service: Received create_user:', data);
    const newUser: User = { id: nextId++, ...data };
    users.push(newUser);
    return newUser;
  }

  @MessagePattern('get_user_by_id')
  getUserById(id: number): User | undefined {
    console.log('User Service: Received get_user_by_id for ID:', id);
    return users.find((user) => user.id === id);
  }
}
