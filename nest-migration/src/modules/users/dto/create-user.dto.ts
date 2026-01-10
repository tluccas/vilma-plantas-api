import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../entities/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MaxLength(150, { message: 'O nome deve ter no máximo 150 caracteres' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsEnum(Role, {
    message: 'o cargo (role) deve ser "admin" ou "customer"',
  })
  @IsOptional()
  role: Role = Role.CUSTOMER;
}
