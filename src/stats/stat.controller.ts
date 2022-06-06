import { HttpService } from '@nestjs/axios';
import {
    Body,
    Controller,
    Get,
    Post,
  } from '@nestjs/common';
  import { TripService } from '../trip/services/trip.service';

  @Controller('stats') // Promises are not the best solution here.
  export class StatController {
      constructor(private tripService: TripService,private httpService: HttpService){

      }

      @Get('weekly')
      async findWeekly(){
          const toDate: string = new Date().toISOString().split('T')[0];
          const temp: Date= new Date();
          temp.setDate(temp.getDate() - (temp.getDay()-1));
          const fromDate: string = temp.toISOString().split('T')[0];
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
            return err;
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
            ridesByDate[trip.date.toISOString().split('T')[0]].push({distance: res.rows[0].elements[0].distance.value,price: trip.price });
          }

          const keys = Object.keys(ridesByDate);
          const res = [];
          keys.map(key=>{
            let distance = 0;
            let price = 0;
            ridesByDate[key].map(obj=>{
              distance+=obj.distance;
              price+=parseFloat(obj.price.split('P')[0]);
            });
            res.push(
              {
                day:  new Date(key).toLocaleString('default',{month: 'long'})+", "+ new Date(key).getDate()+"th",
                total_distance: ((distance/1000).toFixed(2)).toString() + "km" ,
                avg_ride: (((distance/1000)/ridesByDate[key].length).toFixed(2)).toString() + "km",
                avg_price: ((price/ridesByDate[key].length).toFixed(2)).toString()+"PLN"
              }
            );
          }); 
        
          return res;
      
        }
  }