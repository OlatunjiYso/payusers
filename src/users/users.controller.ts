import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseFilters,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

import { HttpExceptionFilter } from './utils/exception.filters';
import { User } from './entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private mailerService: MailerService,
    @Inject('USER_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get(':id/avatar')
  @UseFilters(HttpExceptionFilter)
  async findUserAvatar(@Param() params: any) {
    await this.usersService.findUserAvatar(params.id);
  }

  @Get(':id')
  @UseFilters(HttpExceptionFilter)
  async findUserById(@Param() params: any) {
    await this.usersService.findUserById(params.id);
  }

  @Post()
  @UseFilters(HttpExceptionFilter)
  async addNew(
    @Body() createUserDto: CreateUserDto,
  ) {
    await this.usersService.create(createUserDto);
    this.client.emit<User>('user_created', createUserDto);
    this.mailerService.sendMail({
      to: createUserDto.email,
      subject: 'Welcome',
      context: {
        name: createUserDto.firstname,
      },
    });
  }

  @Delete(':id/avatar')
  @UseFilters(HttpExceptionFilter)
  async deleteImage(@Param() params: any) {
    await this.usersService.deleteUserImage(params.id);
  }
}
