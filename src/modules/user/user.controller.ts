import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-passoword.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePasswordLoggedDto } from './dto/change-password-logged.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthRequest } from '../auth/models/AuthRequest';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('User')
  @Post()
  @IsPublic()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('forgot-password')
  @IsPublic()
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    await this.userService.forgotPassword(forgotPasswordDto.email);
    return {
      message:
        'If your email is registered, you will receive a password reset link.',
    };
  }

  @Post('change-password')
  @IsPublic()
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    await this.userService.changePassword(
      changePasswordDto.token,
      changePasswordDto.newPassword,
    );
    return { message: 'Password changed successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password-logged')
  async changePasswordLogged(
    @Body() changePasswordLoggedDto: ChangePasswordLoggedDto,
    @Req() req: AuthRequest,
  ): Promise<{ message: string }> {
    const { user } = req;
    const userId = user.id;

    if (
      changePasswordLoggedDto.newPassword !==
      changePasswordLoggedDto.confirmPassword
    ) {
      throw new BadRequestException('New passwords do not match');
    }

    await this.userService.changePasswordLogged(
      userId,
      changePasswordLoggedDto.currentPassword,
      changePasswordLoggedDto.newPassword,
    );
    return { message: 'Password changed successfully' };
  }
}
