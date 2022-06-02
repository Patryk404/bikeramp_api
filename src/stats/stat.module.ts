import { Module } from '@nestjs/common';
import { TripService } from '../trip/services/trip.service';
import { StatController } from './stat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TripEntity } from '../trip/models/trip.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [TypeOrmModule.forFeature([TripEntity]),HttpModule],
    providers: [TripService],
    controllers: [StatController]
})
export class StatModule{}
