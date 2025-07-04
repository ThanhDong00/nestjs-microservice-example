import { Module } from '@nestjs/common';
import { PostServiceController } from './post-service.controller';
import { PostServiceService } from './post-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'posts.db',
      entities: [Post],
      synchronize: true, // Chỉ dùng trong development
    }),
    TypeOrmModule.forFeature([Post]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3001, // Port of user-service
        },
      },
    ]),
  ],
  controllers: [PostServiceController],
  providers: [PostServiceService],
})
export class PostServiceModule {}
