import { Controller, Post, Patch, Body, Param, UseGuards, Request, Get, Query } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthRequest } from '../auth/models/AuthRequest';

@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  createItem(@Body() dto: CreateItemDto, @Request() req: AuthRequest,) {
    const { user } = req;
    return this.itemService.createItem(user.id, dto);
  }

  @Patch(':id')
  updateItem(
    @Param('id') itemId: number,
    @Body() dto: UpdateItemDto,
    @Request() req: AuthRequest,
  ) {
    const { user } = req;
    return this.itemService.updateItem(itemId, user.id, dto);
  }

  @Patch(':id/deactivate')
  deactivateItem(@Param('id') itemId: number, @Request() req: AuthRequest,) {
    const { user } = req;
    return this.itemService.deactivateItem(itemId, user.id);
  }

  @Get()
  getItems(
    @Query('name') name?: string,
    @Query('dailyRate') dailyRate?: number,
    @Query('isRented') isRented?: boolean,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.itemService.getItems({ name, dailyRate, isRented, page, limit });
  }
}
