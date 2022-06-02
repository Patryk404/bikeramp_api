import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository,Between } from 'typeorm';

import { TripEntity } from '../models/trip.entity';
import { Trip } from '../models/trip.interface';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(TripEntity)
    private readonly tripRepository: Repository<TripEntity>,
  ) {}

  createPost(trip: Trip): Observable<Trip> {
    const date = new Date(trip.date);
    date.setTime(date.getTime() + (2*60*60*1000));
    trip.date = date;
    return from(this.tripRepository.save(trip));
  }

  findAllPosts(): Observable<Trip[]> {
    return from(this.tripRepository.find());
  }

  async findBetween(date1,date2) {
    return await this.tripRepository.find({
      where: {
        date: Between(new Date(date1),new Date(date2))
      }
    });
  };
}
