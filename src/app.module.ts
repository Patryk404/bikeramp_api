import { Module,HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeolocationService } from './geolocation/geolocation.service';
import { StatModule } from './stats/stat.module';
import { TripModule } from './trip/trip.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true, // shouldn't be used in production - may lose data
    }),
    TripModule,
    StatModule,
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService,GeolocationService],
})
export class AppModule {}