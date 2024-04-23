import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import * as fs from 'fs';
import * as path from 'path';

import { catchError, firstValueFrom } from 'rxjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { saveAvatar } from './utils/saveAvatar';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private httpService: HttpService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (userExists) {
      throw new BadRequestException('User already exists.');
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findUserById(id: number): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<User[]>(`https://reqres.in/api/users/${id}`).pipe(
        catchError((error: AxiosError) => {
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }

  async findUserAvatar(id: string): Promise<string> {
    const user = await this.userModel.findById(id);
    if (!user || !user.avatar) {
      throw new NotFoundException(
        `User with id ${id} not found or has no avatar`,
      );
    }
    let avatar = user.avatar;

    if (avatar.startsWith('http')) {
      const avatarHash = await saveAvatar(avatar, id);
      avatar = avatarHash;

      await this.userModel.findByIdAndUpdate(user._id, {
        $set: { avatar },
      });
    }
    const avatarPath = `${process.cwd()}/src/avatars/${avatar}`;
    const avatarBuffer = fs.readFileSync(avatarPath);
    const b64Avatar = Buffer.from(avatarBuffer).toString('base64');
    return b64Avatar;
  }

  async deleteUserImage(id: string): Promise<any> {
    const user = await this.userModel.findById(id);
    if (!user || !user.avatar) {
      throw new NotFoundException(
        `User with id ${id} not found or has no avatar`,
      );
    }
    const avatarPath = path.resolve(process.cwd(), 'src/avatars', user.avatar);
    await fs.promises.unlink(avatarPath);
    user.avatar = '';
    const editedUser = await user.save();
    return editedUser;
  }
}
