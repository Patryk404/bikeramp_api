import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip.interface';
import { TripService } from '../services/trip.service';

@Controller('trips')
export class TripController {
  constructor(private tripService: TripService) {}

  @Post()
  create(@Body() trip: Trip): Observable<Trip> {
    return this.tripService.createPost(trip);
  }
}
