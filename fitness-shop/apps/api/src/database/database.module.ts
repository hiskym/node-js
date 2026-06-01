import { Module } from '@nestjs/common';
import { db } from '@fitness-shop/db';

export const DATABASE = Symbol('DATABASE');

@Module({
  providers: [
    {
      provide: DATABASE,
      useValue: db,
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule {}