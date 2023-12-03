import { Module } from '@nestjs/common';
import { MeteoController } from './meteo.controller';
import { MeteoService } from './meteo.service';

@Module({
  controllers: [MeteoController],
  providers: [MeteoService],
})
export class MeteoModule {}
