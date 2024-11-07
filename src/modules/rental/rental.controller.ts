import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RentalService } from './rental.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthRequest } from '../auth/models/AuthRequest';

@UseGuards(JwtAuthGuard)
@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post('create')
  async createRental(
    @Request() req: AuthRequest,
    @Body('itemId') itemId: number,
    @Body('startDate') startDate: Date,
    @Body('endDate') endDate: Date,
  ) {
    const { user } = req;
    return this.rentalService.createRental(user.id, itemId, startDate, endDate);
  }

  @Post('webhook')
  async stripeWebhook(@Body() body: any) {
    const event = body;

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const rentalId = paymentIntent.metadata.rentalId;

      await this.rentalService.confirmRentalPayment(Number(rentalId));
    }

    return { received: true };
  }
}
