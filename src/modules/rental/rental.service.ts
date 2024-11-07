import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RentalService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15' as any,
    });
  }

  async createRental(userId: number, itemId: number, startDate: Date | string, endDate: Date | string) {
    const item = await this.prisma.item.findUnique({ where: { id: itemId } });
  
    if (!item) {
      throw new NotFoundException('Item not found');
    }
  
    if (item.isRented) {
      throw new BadRequestException('Item is already rented');
    }
  
    // Converte startDate e endDate para objetos Date, caso sejam strings
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Verifica se a conversão foi bem-sucedida e se as datas são válidas
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid start or end date');
    }
  
    const daysRented = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = daysRented * item.dailyRate;
  
    const rental = await this.prisma.rental.create({
      data: {
        userId,
        itemId,
        startDate: start, // Armazena como instância Date
        endDate: end,     // Armazena como instância Date
        totalPrice,
        paymentStatus: 'pending',
      },
    });
  
    // Criar pagamento no Stripe
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Valor em centavos
      currency: 'usd', // Altere para a moeda que preferir
      metadata: { rentalId: rental.id.toString(), userId: userId.toString() },
    });
  
    return { rental, clientSecret: paymentIntent.client_secret };
  }
  

  async confirmRentalPayment(rentalId: number) {
    await this.prisma.rental.update({
      where: { id: rentalId },
      data: { paymentStatus: 'paid' },
    });

    const rental = await this.prisma.rental.findUnique({
      where: { id: rentalId },
      select: { itemId: true },
    });

    if (rental) {
      await this.prisma.item.update({
        where: { id: rental.itemId },
        data: { isRented: true },
      });
    }

    return { status: 'Pagamento confirmado e aluguel atualizado' };
  }
}
