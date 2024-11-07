import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ItemModule } from './modules/item/item.module';
import { RentalModule } from './modules/rental/rental.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule, 
    AuthModule, 
    ItemModule, 
    RentalModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
