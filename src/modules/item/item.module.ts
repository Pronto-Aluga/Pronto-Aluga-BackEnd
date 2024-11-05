import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";

@Module({
    imports: [],
    controllers: [ItemController],
    providers: [ItemService, PrismaService]
})
export class ItemModule {}