import { Module } from "@nestjs/common";
import { RentalController } from "./rental.controller";
import { PrismaService } from "../prisma/prisma.service";
import { RentalService } from "./rental.service";

@Module({
    imports: [],
    controllers: [RentalController],
    providers: [PrismaService, RentalService]
})
export class RentalModule {}