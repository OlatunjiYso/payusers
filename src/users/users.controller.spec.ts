import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import mongoose from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn((createUserDto) => {
      return {
        id: Math.floor(Math.random() * 10) + 1,
        _id: new mongoose.Types.ObjectId().toString(),
        __v: 0,
        ...createUserDto,
      };
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
    .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile()

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
   
  it('should create a user', () => {
    const newUser: CreateUserDto = {
      firstname: 'Olatunji',
      lastname: 'Guru',
      email: 'pawpaw@fruits.com',
      avatar: 'https://www.jgp.com',
    };
    expect(controller.addNew(newUser)).toEqual({
      id: expect.any(Number),
      _id: expect.any(String),
      __v: expect.any(Number),
      ...newUser,
    });
  });

});
