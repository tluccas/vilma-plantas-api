import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Role } from '../entities/role.enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MaxLength(150, { message: 'O nome deve ter no máximo 150 caracteres' })
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((obj: UpdateUserDto) => obj.password && obj.password.length > 0)
  oldPassword?: string;

  @IsOptional()
  @IsString({ message: 'A nova senha deve ser uma string' })
  @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'A confirmação da senha deve ser uma string' })
  @ValidateIf((obj: UpdateUserDto) => obj.password && obj.password.length > 0)
  confirmPassword?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'O cargo (role) deve ser "customer" ou "admin"' })
  role?: Role;
}
