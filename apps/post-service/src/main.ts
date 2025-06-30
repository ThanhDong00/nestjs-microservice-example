import { NestFactory } from '@nestjs/core';
import { PostServiceModule } from './post-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PostServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 3002,
      },
    },
  );

  await app.listen();
  console.log('Post Service is running on TCP port 3002');
}
bootstrap();
