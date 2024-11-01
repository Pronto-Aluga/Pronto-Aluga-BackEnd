import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { User } from '../../entities/user.entity';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPrfileDto: CreateProfileDto, user: User) {
    return this.prisma.profile.create({
      data: {
        name: createPrfileDto.name,
        image_url: createPrfileDto.image_url,
        document_type: createPrfileDto.document_type,
        document: createPrfileDto.document,
        user_id: user.id,
        phone_number: createPrfileDto.phone_number,
        newsletter: createPrfileDto?.newsletter,
      },
    });
  }

  async listAll(user: User) {
    return this.prisma.profile.findUnique({ where: { user_id: user.id } });
  }
}
