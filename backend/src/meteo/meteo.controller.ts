import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { MeteoService } from './meteo.service';

@UseGuards(JwtGuard)
@Controller('meteo')
export class MeteoController {
  constructor(private meteoService: MeteoService) {}
  @Get('forecast')
  async weatherForecast() {
    return await this.meteoService.sevenDaysForecast();
  }
}
