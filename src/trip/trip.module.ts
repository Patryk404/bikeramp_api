import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TripService } from './services/trip.service';
import { TripController } from './controllers/trip.controller';
import { TripEntity } from './models/trip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TripEntity])],
  providers: [TripService],
  controllers: [TripController],
})
export class TripModule {}
