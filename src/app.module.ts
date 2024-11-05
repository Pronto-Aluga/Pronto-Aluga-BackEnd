import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ItemModule } from './modules/item/item.module';

@Module({
  imports: [UserModule, AuthModule, ItemModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
