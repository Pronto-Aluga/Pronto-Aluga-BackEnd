import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';

interface GetItemsParams {
  name?: string;
  dailyRate?: number;
  isRented?: boolean;
  page: number;
  limit: number;
}

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async createItem(userId: number, dto: CreateItemDto) {
    return this.prisma.item.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async updateItem(itemId: number, userId: number, dto: UpdateItemDto) {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
    });
  
    if (!item) {
      throw new ForbiddenException('Item não encontrado.');
    }
  
    if (item.userId !== userId) {
      throw new ForbiddenException('Acesso negado.');
    }
  
    if (item.isRented) {
      throw new ForbiddenException('Não é possível editar o item enquanto ele estiver alugado.');
    }
  
    return this.prisma.item.update({
      where: { id: itemId },
      data: { ...dto },
    });
  }
  

  async deactivateItem(itemId: number, userId: number) {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new ForbiddenException('Item não encontrado.');
    }

    if (item.userId !== userId) {
      throw new ForbiddenException('Acesso negado.');
    }

    if (item.isRented) {
      throw new ForbiddenException('Não é possível desativar o item enquanto ele estiver alugado.');
    }

    return this.prisma.item.update({
      where: { id: itemId },
      data: { isActive: false },
    });
  }

  async getItems(params: GetItemsParams) {
    const { name, dailyRate, isRented, page, limit } = params;

    const where: any = {};

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (dailyRate) {
      where.dailyRate = dailyRate;
    }
    if (isRented !== undefined) {
      where.isRented = isRented;
    }

    const offset = (page - 1) * limit;

    const items = await this.prisma.item.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const totalItems = await this.prisma.item.count({ where });

    return {
      data: items,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }
}
