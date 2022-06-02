import { HttpService } from '@nestjs/axios';
import {
    Body,
    Controller,
    Get,
    Post,
  } from '@nestjs/common';
  import { TripService } from '../trip/services/trip.service';

  @Controller('stats')
  export class StatController {
      constructor(private tripService: TripService,private httpService: HttpService){

      }

      @Get('weekly')
      async findWeekly(){
          const toDate: string = new Date().toISOString().split('T')[0];
          const temp: Date= new Date();
          temp.setDate(temp.getDate() - (temp.getDay()-1));
          const fromDate: string = temp.toISOString().split('T')[0];
          console.log(fromDate);
          console.log(toDate);
          const trips = await this.tripService.findBetween(fromDate,toDate)

          let sum_distance = 0;
          let sum_price=0;
          try{
            for(const trip of trips){
              console.log(trip);
              let url = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${trip.start_address}&destinations=${trip.destination_address}&key=${process.env.API_TOKEN}`
              url = encodeURI(url);
              console.log(url);
              const res = (await this.httpService.get(url).toPromise()).data
              console.log(res);
              sum_distance += res.rows[0].elements[0].distance.value;
              const price =parseFloat(trip.price.split('P')[0]);
              sum_price+=price;
            }
  
            return {
              total_distance: sum_distance/1000+"km",
              total_price: sum_price + "PLN"
            };
          }
          catch(err){
            console.log(err); 
          }
      }


      @Get("monthly")
      async findMonthly(){
          const toDate = new Date();
          const temp = (new Date());
          temp.setDate(1);
          const fromDate = temp.toISOString().split('T')[0];
          const trips = await this.tripService.findBetween(fromDate,toDate);
          const ridesByDate = {};
          for(const trip of trips){
            ridesByDate[trip.date.toISOString().split('T')[0]] = [];
          }
          for(const trip of trips){
            let url = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${trip.start_address}&destinations=${trip.destination_address}&key=${process.env.API_TOKEN}`
              url = encodeURI(url);
            const res = (await this.httpService.get(url).toPromise()).data
            console.log(res.rows[0].elements[0].distance.value);
            ridesByDate[trip.date.toISOString().split('T')[0]].push({distance: res.rows[0].elements[0].distance.value,price: trip.price });
          }

          // console.log(ridesByDate); 
          return trips;
      
        }
  }