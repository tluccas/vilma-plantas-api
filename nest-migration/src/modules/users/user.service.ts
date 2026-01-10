import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const allUsers = await this.userRepository.find();
    return allUsers;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário de ID ${id} não encontrado.`);
    }
    return user;
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const emailExists = await this.userRepository.findOneBy({
      email: userDto.email,
    });
    if (emailExists) {
      throw new ConflictException(`Email já cadastrado.`);
    }

    const { password, ...userData } = userDto;
    const salt = await bcrypt.genSalt();

    const passwordHash = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      ...userData,
      password: passwordHash,
    });
    try {
      return await this.userRepository.save(user);
    } catch {
      throw new InternalServerErrorException(
        'Erro inesperado ao salvar o usuário no banco de dados.',
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.userRepository.findOneBy({
        email: updateUserDto.email,
      });
      if (emailExists) {
        throw new ConflictException(
          'Este e-mail já está em uso por outro usuário.',
        );
      }
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updatedUser = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });

    try {
      return await this.userRepository.save(updatedUser);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao atualizar o usuário.');
    }
  }
}
