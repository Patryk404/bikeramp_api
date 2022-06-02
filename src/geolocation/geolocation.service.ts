import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class GeolocationService {
    constructor(private http: HttpService){

    }

    getLatLng(){
    }
}