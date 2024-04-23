import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.AMQP_URL],
          queue: 'user_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    MailerModule.forRoot({
      transport: {
        host: process.env.APP_MAILER_HOST,
        port: process.env.APP_MAILER_PORT,
        secure: false,
        auth: {
          user: process.env.APP_MAILER_USERNAME,
          pass: process.env.APP_MAILER_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <from@example.com>',
      },
    }),
    HttpModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
