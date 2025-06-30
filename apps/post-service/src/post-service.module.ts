import { Module } from '@nestjs/common';
import { PostServiceController } from './post-service.controller';
import { PostServiceService } from './post-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
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
