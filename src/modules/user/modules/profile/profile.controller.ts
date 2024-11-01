import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateProfileDto } from './dto/create-profile.dto';
import { AuthRequest } from 'src/modules/auth/models/AuthRequest';
import { ProfileService } from './profile.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new profile' })
  @ApiResponse({ status: 200, description: 'Profile created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() createProfileDto: CreateProfileDto,
    @Request() req: AuthRequest,
  ) {
    const { user } = req;
    return this.profileService.create(createProfileDto, user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all profiles for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Profiles retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async listAll(@Request() req: AuthRequest) {
    const { user } = req;
    return this.profileService.listAll(user);
  }
}
